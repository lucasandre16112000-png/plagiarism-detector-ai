import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  documents, 
  analyses, 
  plagiarismSources, 
  aiDetectionResults,
  InsertDocument,
  InsertAnalysis,
  InsertPlagiarismSource,
  InsertAiDetectionResult
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Document operations
export async function createDocument(doc: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(documents).values(doc);
  return result;
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));
}

export async function updateDocumentStatus(id: number, status: "pending" | "processing" | "completed" | "failed", extractedText?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (extractedText !== undefined) {
    updateData.extractedText = extractedText;
  }
  
  await db.update(documents).set(updateData).where(eq(documents.id, id));
}

// Analysis operations
export async function createAnalysis(analysis: InsertAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(analyses).values(analysis);
  return result;
}

export async function getAnalysisById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(analyses).where(eq(analyses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAnalysisByDocumentId(documentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(analyses)
    .where(eq(analyses.documentId, documentId))
    .orderBy(desc(analyses.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserAnalyses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(analyses)
    .where(eq(analyses.userId, userId))
    .orderBy(desc(analyses.createdAt));
}

export async function updateAnalysis(id: number, data: Partial<InsertAnalysis>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(analyses).set(data).where(eq(analyses.id, id));
}

// Plagiarism sources operations
export async function createPlagiarismSource(source: InsertPlagiarismSource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(plagiarismSources).values(source);
  return result;
}

export async function getPlagiarismSourcesByAnalysisId(analysisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(plagiarismSources)
    .where(eq(plagiarismSources.analysisId, analysisId))
    .orderBy(desc(plagiarismSources.similarityScore));
}

// AI detection results operations
export async function createAiDetectionResult(result: InsertAiDetectionResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const insertResult = await db.insert(aiDetectionResults).values(result);
  return insertResult;
}

export async function getAiDetectionResultsByAnalysisId(analysisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(aiDetectionResults)
    .where(eq(aiDetectionResults.analysisId, analysisId))
    .orderBy(desc(aiDetectionResults.aiProbability));
}
