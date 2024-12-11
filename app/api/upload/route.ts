// Import necessary modules
import { NextResponse } from 'next/server';
import { IncomingForm, Fields, Files } from 'formidable';
import * as pdfjsLib from 'pdfjs-dist';
import { Readable } from 'stream';
// import fs from 'fs';
import path from 'path';

// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.worker.js');

// Helper function to parse the form data
const parseForm = async (request: Request): Promise<{ fields: Fields; files: Files }> => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(Buffer.from(await request.arrayBuffer()));
  readable.push(null);

  const headers: Record<string, string> = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key.toLowerCase()] = value;
  }

  (readable as any).headers = headers;

  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: true,
      uploadDir: "./uploads",
      keepExtensions: true,
    });
    form.parse(readable as any, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// Extract text from PDF
const extractTextFromPDF = async (filePath: string): Promise<string> => {
  const loadingTask = pdfjsLib.getDocument(filePath);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let text = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(' ');
  }

  return text;
};

// Handle POST request
export async function POST(request: Request) {
  try {
    console.log("[UPLOAD API]: Received request...");
    const { fields, files } = await parseForm(request);
    console.log("[UPLOAD API]: Form data parsed successfully.");
    console.log("[UPLOAD API]: Fields:", fields);
    console.log("[UPLOAD API]: Files:", files);

    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    if (fileArray.length === 0) throw new Error("No files uploaded.");

    let combinedText = '';
    for (const file of fileArray) {
      const filePath = file.filepath;
      console.log(`[UPLOAD API]: Extracting text from PDF: ${file.originalFilename}`);
      const text = await extractTextFromPDF(filePath);
      console.log(`[UPLOAD API]: Extracted text from ${file.originalFilename}: ${text}`);
      combinedText += text + '\n';
    }

    return NextResponse.json({ text: combinedText });
  } catch (err) {
    console.error("[UPLOAD API]: Error processing request:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Disable body parsing for Next.js (required for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};