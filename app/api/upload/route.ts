// Import necessary modules
import { NextResponse } from 'next/server';
import { IncomingForm, Fields, Files } from 'formidable';
import * as pdfjsLib from 'pdfjs-dist';
import { Readable } from 'stream';
import path from 'path';

let storedFields: any = null; // In-memory store for fields
let storedStructuredData: any = null; // In-memory store for structured data

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

// Function to clean and preprocess extracted text
const cleanText = (rawText: string): string => {
  return rawText
    .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with a single space
    .replace(/Page \d+/gi, '') // Remove occurrences like "Page 1"
    .trim(); // Remove leading and trailing spaces
};


// Function to extract structured data from the cleaned text
const extractStructuredData = (text: string) => {
  const structuredData: Record<string, string | string[]> = {};

  // Flexible Contact Information Extraction
  const nameMatch = text.match(/^\s*(?:Name[:\-]?)?\s*([A-Z][a-zA-Z]*\s+[A-Z][a-zA-Z]*)(?=\s*(?:Email|Phone|Address|$|\n|))/im);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+91[-\s]?)?\d{10}/);
  const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+/i);
  const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s]+/i);

  structuredData.name = nameMatch ? nameMatch[1].trim() : 'Unknown';
  structuredData.email = emailMatch ? emailMatch[0] : 'Unknown';
  structuredData.phone = phoneMatch ? phoneMatch[0] : 'Unknown';
  structuredData.linkedin = linkedinMatch ? linkedinMatch[0] : 'Not Provided';
  structuredData.github = githubMatch ? githubMatch[0] : 'Not Provided';

  // Enhanced Skills Extraction
  const skillsSectionMatch = text.match(/(skills|technical skills|languages|competencies|proficiencies|expertise)\s*[\:\-]?\s*([\s\S]+?)(\n{2,}|$)/i);
  structuredData.skills = skillsSectionMatch
    ? skillsSectionMatch[2]
        .split(/[,;\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill)
    : [];

  // Enhanced Experience Section Detection
  const experienceMatch = text.match(/(experience|work experience|professional experience|employment history|career history|open source contributions)\s*[\:\-]?\s*([\s\S]+?)(\n{2,}|education|skills|projects|achievements|extracurricular)/i);
  structuredData.experience = experienceMatch ? experienceMatch[2].trim() : 'No Experience Found';

  // Enhanced Projects Section Extraction
  const projectsMatch = text.match(/(projects|notable projects|portfolio|case studies|research)\s*[\:\-]?\s*([\s\S]+?)(\n{2,}|achievements|experience|skills|extracurricular)/i);
  structuredData.projects = projectsMatch ? projectsMatch[2].trim() : 'No Projects Found';

  // Enhanced Achievements Section Extraction
  const achievementsMatch = text.match(/(achievements|awards|honors|extracurricular|certifications|accomplishments)\s*[\:\-]?\s*([\s\S]+?)$/i);
  structuredData.achievements = achievementsMatch ? achievementsMatch[2].trim() : 'No Achievements Found';

  // Enhanced Education Section Detection
  const educationMatch = text.match(/(education|academic background|qualifications|academic qualifications|academic history|educational background)\s*[\:\-]?\s*([\s\S]+?)(\n{2,}|technical skills|skills|experience|projects)/i);
  structuredData.education = educationMatch ? educationMatch[2].trim() : 'No Education Found';

  return structuredData;
};

// Function to validate the structured data
const validateStructuredData = (data: Record<string, string | string[]>) => {
  // Check for missing or "Unknown" fields
  for (const [key, value] of Object.entries(data)) {
    if (!value || (typeof value === 'string' && value === 'Unknown')) {
      console.warn(`Warning: Missing or incomplete ${key}`);
    }
  }
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
    storedFields = fields;

    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    if (fileArray.length === 0) throw new Error("No files uploaded.");

    const results = [];
    for (const file of fileArray) {
      const filePath = file.filepath;
      console.log(`[UPLOAD API]: Extracting text from PDF: ${file.originalFilename}`);
      const text = await extractTextFromPDF(filePath);
      // *console.log([UPLOAD API]: Extracted text from ${file.originalFilename}: ${text});

      // Clean the text
      const cleanedText = cleanText(text);
      // *console.log("[UPLOAD API]: Cleaned Text:", cleanedText);

      // Extract structured data from the cleaned text
      const structuredData = extractStructuredData(cleanedText);

      // Validate the structured data
      validateStructuredData(structuredData);

      // Log the final refined JSON object for verification
      console.log("[UPLOAD API]: Final Refined JSON Object:", structuredData);

      // Add the structured data to the results array
      results.push({ fileName: file.originalFilename, structuredData });
    }

    // Store the structured data
    storedStructuredData = results.map(result => result.structuredData);

    // Include the redirect URL in the JSON response
    return NextResponse.json({ fields, results, redirectUrl: '/shortlist' });
  } catch (err) {
    console.error("[UPLOAD API]: Error processing request:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle GET request
export async function GET() {
  try {
    if (!storedFields || !storedStructuredData) {
      return NextResponse.json({ error: 'No data available' }, { status: 404 });
    }
    return NextResponse.json({ fields: storedFields, structuredData: storedStructuredData });
  } catch (err) {
    console.error("[UPLOAD API]: Error processing request:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Disable body parsing for Next.js (required for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};