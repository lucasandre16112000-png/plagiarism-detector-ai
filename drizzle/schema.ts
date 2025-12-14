import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, float } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Documents uploaded for plagiarism analysis
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalFilename: varchar("originalFilename", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 50 }).notNull(),
  fileSize: int("fileSize").notNull(),
  s3Key: text("s3Key").notNull(),
  s3Url: text("s3Url").notNull(),
  extractedText: text("extractedText"),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Analysis results for each document
 */
export const analyses = mysqlTable("analyses", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  userId: int("userId").notNull(),
  plagiarismPercentage: float("plagiarismPercentage").default(0).notNull(),
  aiContentPercentage: float("aiContentPercentage").default(0).notNull(),
  confidenceScore: float("confidenceScore").default(0).notNull(),
  totalSources: int("totalSources").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  analysisData: text("analysisData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;

/**
 * Plagiarism sources found during analysis
 */
export const plagiarismSources = mysqlTable("plagiarism_sources", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  sourceUrl: text("sourceUrl"),
  sourceTitle: text("sourceTitle"),
  sourceType: varchar("sourceType", { length: 50 }).notNull(),
  similarityScore: float("similarityScore").notNull(),
  matchedText: text("matchedText"),
  originalText: text("originalText"),
  startPosition: int("startPosition"),
  endPosition: int("endPosition"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlagiarismSource = typeof plagiarismSources.$inferSelect;
export type InsertPlagiarismSource = typeof plagiarismSources.$inferInsert;

/**
 * AI detection results for text segments
 */
export const aiDetectionResults = mysqlTable("ai_detection_results", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  textSegment: text("textSegment").notNull(),
  aiProbability: float("aiProbability").notNull(),
  startPosition: int("startPosition").notNull(),
  endPosition: int("endPosition").notNull(),
  detectionMethod: varchar("detectionMethod", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiDetectionResult = typeof aiDetectionResults.$inferSelect;
export type InsertAiDetectionResult = typeof aiDetectionResults.$inferInsert;
