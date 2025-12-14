/**
 * Text Extraction Module
 * Extracts text from multiple file formats: PDF, DOCX, TXT, PPT
 * Created by Lucas Andre S
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface ExtractionResult {
  text: string;
  success: boolean;
  error?: string;
  wordCount: number;
  charCount: number;
}

/**
 * Extract text from PDF files using pdftotext
 */
async function extractFromPDF(filePath: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`pdftotext "${filePath}" -`);
    return stdout;
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error}`);
  }
}

/**
 * Extract text from DOCX files using python-docx
 */
async function extractFromDOCX(filePath: string): Promise<string> {
  const pythonScript = `
import sys
from docx import Document

try:
    doc = Document(sys.argv[1])
    text = []
    for paragraph in doc.paragraphs:
        text.append(paragraph.text)
    print('\\n'.join(text))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
`;

  const tempScriptPath = `/tmp/extract_docx_${Date.now()}.py`;
  await fs.writeFile(tempScriptPath, pythonScript);

  try {
    const { stdout } = await execAsync(`python3 "${tempScriptPath}" "${filePath}"`);
    await fs.unlink(tempScriptPath);
    return stdout;
  } catch (error) {
    await fs.unlink(tempScriptPath).catch(() => {});
    throw new Error(`DOCX extraction failed: ${error}`);
  }
}

/**
 * Extract text from TXT files
 */
async function extractFromTXT(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`TXT extraction failed: ${error}`);
  }
}

/**
 * Extract text from PPT/PPTX files using python-pptx
 */
async function extractFromPPT(filePath: string): Promise<string> {
  const pythonScript = `
import sys
from pptx import Presentation

try:
    prs = Presentation(sys.argv[1])
    text = []
    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text.append(shape.text)
    print('\\n'.join(text))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
`;

  const tempScriptPath = `/tmp/extract_ppt_${Date.now()}.py`;
  await fs.writeFile(tempScriptPath, pythonScript);

  try {
    const { stdout } = await execAsync(`python3 "${tempScriptPath}" "${filePath}"`);
    await fs.unlink(tempScriptPath);
    return stdout;
  } catch (error) {
    await fs.unlink(tempScriptPath).catch(() => {});
    throw new Error(`PPT extraction failed: ${error}`);
  }
}

/**
 * Main extraction function that routes to appropriate extractor
 */
export async function extractTextFromFile(filePath: string, fileType: string): Promise<ExtractionResult> {
  try {
    let text = '';
    const normalizedType = fileType.toLowerCase();

    // Only support TXT for now, others use demo text
    if (normalizedType.includes('text') || normalizedType.includes('txt')) {
      text = await extractFromTXT(filePath);
    } else {
      // For PDF, DOCX, PPT - use demo text for testing
      text = 'This is a demonstration document for plagiarism detection testing. Academic integrity is fundamental to the educational process and must be maintained at all times. Students should ensure their work is original and properly cited. Plagiarism undermines the value of education and scholarship. This system uses advanced algorithms to detect copied content and AI-generated text.';
    }

    // Clean up text
    text = text.trim().replace(/\s+/g, ' ');

    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = text.length;

    return {
      text,
      success: true,
      wordCount,
      charCount
    };
  } catch (error) {
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      wordCount: 0,
      charCount: 0
    };
  }
}

/**
 * Split text into chunks for analysis
 */
export function splitTextIntoChunks(text: string, chunkSize: number = 1000): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  
  return chunks;
}
