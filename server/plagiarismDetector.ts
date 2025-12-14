/**
 * Advanced Plagiarism Detection Module
 * Uses multiple algorithms for text similarity and plagiarism detection
 * Created by Lucas Andre S
 */

import { invokeLLM } from "./_core/llm";

export interface PlagiarismMatch {
  sourceUrl?: string;
  sourceTitle?: string;
  sourceType: string;
  similarityScore: number;
  matchedText: string;
  originalText: string;
  startPosition: number;
  endPosition: number;
}

export interface PlagiarismResult {
  overallPercentage: number;
  matches: PlagiarismMatch[];
  totalSources: number;
  confidenceScore: number;
}

/**
 * Calculate Jaccard similarity between two texts
 */
function jaccardSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set(Array.from(words1).filter(x => words2.has(x)));
  const union = new Set([...Array.from(words1), ...Array.from(words2)]);
  
  return intersection.size / union.size;
}

/**
 * Calculate cosine similarity between two texts
 */
function cosineSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const allWords = Array.from(new Set([...words1, ...words2]));
  const vector1 = allWords.map(word => words1.filter(w => w === word).length);
  const vector2 = allWords.map(word => words2.filter(w => w === word).length);
  
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
  
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Generate n-grams from text
 */
function generateNGrams(text: string, n: number): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const ngrams: string[] = [];
  
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  
  return ngrams;
}

/**
 * Calculate n-gram similarity
 */
function ngramSimilarity(text1: string, text2: string, n: number = 3): number {
  const ngrams1 = new Set(generateNGrams(text1, n));
  const ngrams2 = new Set(generateNGrams(text2, n));
  
  const intersection = new Set(Array.from(ngrams1).filter(x => ngrams2.has(x)));
  const union = new Set([...Array.from(ngrams1), ...Array.from(ngrams2)]);
  
  return intersection.size / union.size;
}

/**
 * Detect plagiarism using AI-powered semantic analysis
 */
async function detectSemanticSimilarity(text1: string, text2: string): Promise<number> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert in detecting text similarity and plagiarism. Analyze the semantic similarity between two texts and return ONLY a number between 0 and 1, where 0 means completely different and 1 means identical or plagiarized."
        },
        {
          role: "user",
          content: `Text 1: ${text1}\n\nText 2: ${text2}\n\nProvide similarity score (0-1):`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    const contentStr = typeof content === 'string' ? content : '0';
    const score = parseFloat(contentStr.trim());
    return isNaN(score) ? 0 : Math.min(Math.max(score, 0), 1);
  } catch (error) {
    console.error("Semantic similarity detection failed:", error);
    return 0;
  }
}

/**
 * Search for similar content on the internet (simulated)
 */
async function searchInternetSources(text: string): Promise<PlagiarismMatch[]> {
  // Simulate internet search results
  const matches: PlagiarismMatch[] = [];
  
  // In a real implementation, this would use search APIs
  // For now, we'll use AI to generate potential sources
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a plagiarism detection system. Analyze the text and identify if it resembles common academic sources, Wikipedia articles, or published content. Return results in JSON format."
        },
        {
          role: "user",
          content: `Analyze this text for potential plagiarism sources:\n\n${text.substring(0, 1000)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "plagiarism_sources",
          strict: true,
          schema: {
            type: "object",
            properties: {
              sources: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    type: { type: "string" },
                    similarity: { type: "number" }
                  },
                  required: ["title", "type", "similarity"],
                  additionalProperties: false
                }
              }
            },
            required: ["sources"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    const contentStr = typeof content === 'string' ? content : '';
    if (contentStr) {
      const data = JSON.parse(contentStr);
      data.sources.forEach((source: any, index: number) => {
        if (source.similarity > 0.3) {
          matches.push({
            sourceTitle: source.title,
            sourceType: source.type,
            similarityScore: source.similarity,
            matchedText: text.substring(0, 200),
            originalText: text.substring(0, 200),
            startPosition: 0,
            endPosition: 200
          });
        }
      });
    }
  } catch (error) {
    console.error("Internet source search failed:", error);
  }
  
  return matches;
}

/**
 * Compare text against internal database
 */
async function compareWithDatabase(text: string): Promise<PlagiarismMatch[]> {
  // Simulate database comparison
  // In production, this would query a real database of documents
  const matches: PlagiarismMatch[] = [];
  
  // Simulate some matches
  const sampleTexts = [
    "Academic integrity is fundamental to the educational process.",
    "Plagiarism undermines the value of original work and scholarship.",
    "Proper citation is essential in academic writing."
  ];
  
  for (let i = 0; i < sampleTexts.length; i++) {
    const similarity = cosineSimilarity(text, sampleTexts[i]);
    if (similarity > 0.3) {
      matches.push({
        sourceTitle: `Internal Document ${i + 1}`,
        sourceType: "database",
        similarityScore: similarity,
        matchedText: sampleTexts[i],
        originalText: text.substring(0, 100),
        startPosition: 0,
        endPosition: 100
      });
    }
  }
  
  return matches;
}

/**
 * Main plagiarism detection function
 */
export async function detectPlagiarism(text: string): Promise<PlagiarismResult> {
  try {
    const matches: PlagiarismMatch[] = [];
    
    // 1. Compare with internal database
    const dbMatches = await compareWithDatabase(text);
    matches.push(...dbMatches);
    
    // 2. Search internet sources
    const internetMatches = await searchInternetSources(text);
    matches.push(...internetMatches);
    
    // 3. Calculate overall plagiarism percentage
    let totalSimilarity = 0;
    matches.forEach(match => {
      totalSimilarity += match.similarityScore;
    });
    
    const overallPercentage = matches.length > 0 
      ? Math.min((totalSimilarity / matches.length) * 100, 100)
      : 0;
    
    // 4. Calculate confidence score based on number of sources and similarity
    const confidenceScore = matches.length > 0
      ? Math.min((matches.length * 0.2 + (totalSimilarity / matches.length) * 0.8) * 100, 100)
      : 95; // High confidence if no plagiarism found
    
    return {
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      matches: matches.sort((a, b) => b.similarityScore - a.similarityScore),
      totalSources: matches.length,
      confidenceScore: Math.round(confidenceScore * 100) / 100
    };
  } catch (error) {
    console.error("Plagiarism detection failed:", error);
    return {
      overallPercentage: 0,
      matches: [],
      totalSources: 0,
      confidenceScore: 0
    };
  }
}

/**
 * Analyze text segments for plagiarism
 */
export async function analyzeTextSegments(text: string, segmentSize: number = 500): Promise<PlagiarismMatch[]> {
  const words = text.split(/\s+/);
  const segments: string[] = [];
  
  for (let i = 0; i < words.length; i += segmentSize) {
    segments.push(words.slice(i, i + segmentSize).join(' '));
  }
  
  const allMatches: PlagiarismMatch[] = [];
  
  for (let i = 0; i < segments.length; i++) {
    const result = await detectPlagiarism(segments[i]);
    allMatches.push(...result.matches);
  }
  
  return allMatches;
}
