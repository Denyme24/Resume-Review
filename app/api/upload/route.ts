// Import necessary modules
import { NextResponse } from 'next/server';
import { IncomingForm, Fields, Files } from 'formidable';
import * as pdfjsLib from 'pdfjs-dist';
import { Readable } from 'stream';
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

  // Extract Contact Information
  const nameMatch = text.match(/^\w+ \w+/); // First two words as name (improve if needed)
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+91[-\s]?)?\d{10}/);
  const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+/i); // Enhanced LinkedIn regex
  const githubMatch = text.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s]+/i); // Enhanced GitHub regex

  structuredData.name = nameMatch ? nameMatch[0] : 'Unknown';
  structuredData.email = emailMatch ? emailMatch[0] : 'Unknown';
  structuredData.phone = phoneMatch ? phoneMatch[0] : 'Unknown';
  structuredData.linkedin = linkedinMatch ? linkedinMatch[0] : 'Not Provided';
  structuredData.github = githubMatch ? githubMatch[0] : 'Not Provided';

  // Extract Technical Skills
  const skillsMatch = text.match(/Technical Skills\s+([^\n]+)/i);
  structuredData.skills = skillsMatch ? skillsMatch[1].split(',').map(skill => skill.trim()) : [];

  // Extract Experience - Enhanced to capture more variations
  const experienceMatch = text.match(/Experience\s*[\:\-]?\s*([\s\S]+?)(Education|Skills|Projects|Achievements)/i);
  structuredData.experience = experienceMatch ? experienceMatch[1].trim() : 'No Experience Found';

  // Extract Projects
  const projectsMatch = text.match(/Projects\s+([\s\S]+?)Achievements/i);
  structuredData.projects = projectsMatch ? projectsMatch[1].trim() : 'No Projects Found';

  // Extract Achievements
  const achievementsMatch = text.match(/Achievements\s+([\s\S]+?)$/i);
  structuredData.achievements = achievementsMatch ? achievementsMatch[1].trim() : 'No Achievements Found';

  // Extract Education
  const educationMatch = text.match(/Education\s+([\s\S]+?)Technical Skills/i);
  structuredData.education = educationMatch ? educationMatch[1].trim() : 'No Education Found';

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

    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    if (fileArray.length === 0) throw new Error("No files uploaded.");

    const results = [];
    for (const file of fileArray) {
      const filePath = file.filepath;
      console.log(`[UPLOAD API]: Extracting text from PDF: ${file.originalFilename}`);
      const text = await extractTextFromPDF(filePath);
      // *console.log(`[UPLOAD API]: Extracted text from ${file.originalFilename}: ${text}`);

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

    // Include the redirect URL in the JSON response
    return NextResponse.json({ results, redirectUrl: '/shortlist' });
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