import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import * as db from "./db";
import { extractTextFromFile } from "./textExtractor";
import { detectPlagiarism } from "./plagiarismDetector";
import { detectAIContent } from "./aiDetector";
import fs from "fs/promises";
import path from "path";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  documents: router({
    upload: protectedProcedure
      .input(z.object({
        filename: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
        fileData: z.string(), // base64 encoded
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Decode base64 file data
          const fileBuffer = Buffer.from(input.fileData, 'base64');
          
          // Generate unique filename
          const fileExtension = path.extname(input.filename);
          const uniqueFilename = `${nanoid()}-${Date.now()}${fileExtension}`;
          const s3Key = `documents/${ctx.user.id}/${uniqueFilename}`;
          
          // Upload to S3
          const { url } = await storagePut(s3Key, fileBuffer, input.fileType);
          
          // Save temporary file for text extraction
          const tempDir = '/tmp/plagiarism-uploads';
          await fs.mkdir(tempDir, { recursive: true });
          const tempFilePath = path.join(tempDir, uniqueFilename);
          await fs.writeFile(tempFilePath, fileBuffer);
          
          // Extract text from file
          const extractionResult = await extractTextFromFile(tempFilePath, input.fileType);
          
          // Clean up temp file
          await fs.unlink(tempFilePath).catch(() => {});
          
          // Create document record
          const result = await db.createDocument({
            userId: ctx.user.id,
            filename: uniqueFilename,
            originalFilename: input.filename,
            fileType: input.fileType,
            fileSize: input.fileSize,
            s3Key,
            s3Url: url,
            extractedText: extractionResult.text,
            status: extractionResult.success ? 'completed' : 'failed',
          });
          
          return {
            success: true,
            documentId: Number((result as any).insertId),
            extractedText: extractionResult.text,
            wordCount: extractionResult.wordCount,
          };
        } catch (error) {
          console.error('Upload failed:', error);
          throw new Error('Failed to upload document');
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserDocuments(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getDocumentById(input.id);
      }),
  }),

  analysis: router({
    create: protectedProcedure
      .input(z.object({
        documentId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Get document
          const document = await db.getDocumentById(input.documentId);
          if (!document) {
            throw new Error('Document not found');
          }
          
          if (!document.extractedText) {
            throw new Error('No text extracted from document');
          }
          
          // Create analysis record
          const analysisResult = await db.createAnalysis({
            documentId: input.documentId,
            userId: ctx.user.id,
            status: 'processing',
          });
          
          const analysisId = Number((analysisResult as any).insertId);
          
          // Run plagiarism detection
          const plagiarismResult = await detectPlagiarism(document.extractedText);
          
          // Run AI detection
          const aiResult = await detectAIContent(document.extractedText);
          
          // Save plagiarism sources
          for (const match of plagiarismResult.matches) {
            await db.createPlagiarismSource({
              analysisId,
              sourceUrl: match.sourceUrl,
              sourceTitle: match.sourceTitle,
              sourceType: match.sourceType,
              similarityScore: match.similarityScore,
              matchedText: match.matchedText,
              originalText: match.originalText,
              startPosition: match.startPosition,
              endPosition: match.endPosition,
            });
          }
          
          // Save AI detection results
          for (const segment of aiResult.segments) {
            await db.createAiDetectionResult({
              analysisId,
              textSegment: segment.textSegment,
              aiProbability: segment.aiProbability,
              startPosition: segment.startPosition,
              endPosition: segment.endPosition,
              detectionMethod: segment.detectionMethod,
            });
          }
          
          // Update analysis with results
          await db.updateAnalysis(analysisId, {
            plagiarismPercentage: plagiarismResult.overallPercentage,
            aiContentPercentage: aiResult.overallPercentage,
            confidenceScore: (plagiarismResult.confidenceScore + aiResult.confidenceScore) / 2,
            totalSources: plagiarismResult.totalSources,
            status: 'completed',
            completedAt: new Date(),
            analysisData: JSON.stringify({
              plagiarism: plagiarismResult,
              ai: aiResult,
            }),
          });
          
          return {
            success: true,
            analysisId,
            plagiarismPercentage: plagiarismResult.overallPercentage,
            aiContentPercentage: aiResult.overallPercentage,
            confidenceScore: (plagiarismResult.confidenceScore + aiResult.confidenceScore) / 2,
          };
        } catch (error) {
          console.error('Analysis failed:', error);
          throw new Error('Failed to analyze document');
        }
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const analysis = await db.getAnalysisById(input.id);
        if (!analysis) return null;
        
        const sources = await db.getPlagiarismSourcesByAnalysisId(input.id);
        const aiResults = await db.getAiDetectionResultsByAnalysisId(input.id);
        
        return {
          ...analysis,
          sources,
          aiResults,
        };
      }),

    getByDocument: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .query(async ({ input }) => {
        const analysis = await db.getAnalysisByDocumentId(input.documentId);
        if (!analysis) return null;
        
        const sources = await db.getPlagiarismSourcesByAnalysisId(analysis.id);
        const aiResults = await db.getAiDetectionResultsByAnalysisId(analysis.id);
        
        return {
          ...analysis,
          sources,
          aiResults,
        };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAnalyses(ctx.user.id);
    }),
  }),

  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      const documents = await db.getUserDocuments(ctx.user.id);
      const analyses = await db.getUserAnalyses(ctx.user.id);
      
      const completedAnalyses = analyses.filter(a => a.status === 'completed');
      
      const avgPlagiarism = completedAnalyses.length > 0
        ? completedAnalyses.reduce((sum, a) => sum + a.plagiarismPercentage, 0) / completedAnalyses.length
        : 0;
      
      const avgAI = completedAnalyses.length > 0
        ? completedAnalyses.reduce((sum, a) => sum + a.aiContentPercentage, 0) / completedAnalyses.length
        : 0;
      
      return {
        totalDocuments: documents.length,
        totalAnalyses: analyses.length,
        completedAnalyses: completedAnalyses.length,
        avgPlagiarismPercentage: Math.round(avgPlagiarism * 100) / 100,
        avgAIPercentage: Math.round(avgAI * 100) / 100,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
