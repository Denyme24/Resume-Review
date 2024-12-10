import { NextResponse } from "next/server";
import { IncomingForm, Fields, Files } from "formidable";
import { Readable } from "stream";
import fs from "fs";

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Convert Fetch API Request to a Node.js-readable stream
const convertRequestToIncomingMessage = async (
  request: Request
): Promise<Readable & { headers: Record<string, string> }> => {
  const readable = new Readable();
  readable._read = () => {}; // No-op
  readable.push(Buffer.from(await request.arrayBuffer()));
  readable.push(null); // End of stream

  // Attach headers
  (readable as any).headers = Object.fromEntries(request.headers);
  return readable as Readable & { headers: Record<string, string> };
};

// Helper function to handle Formidable
const parseForm = async (
  request: Request
): Promise<{ fields: Fields; files: Files }> => {
  const form = new IncomingForm({
    multiples: true, // Allow multiple files
    uploadDir: "./uploads", // Directory for uploaded files
    keepExtensions: true, // Preserve file extensions
  });

  const stream = await convertRequestToIncomingMessage(request);

  return new Promise((resolve, reject) => {
    form.parse(stream as any, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// Handle POST request
export async function POST(request: Request) {
  try {
    // Ensure uploads directory exists
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const { fields, files } = await parseForm(request);

    // Access form fields
    const jobTitle = fields.jobTitle as string;
    const jobDesc = fields.jobDesc as string;

    // Access uploaded files
    const uploadedFiles = Array.isArray(files.files)
      ? files.files
      : [files.files];

    console.log("Job Title:", jobTitle);
    console.log("Job Description:", jobDesc);
    console.log("Uploaded Files:", uploadedFiles);

    return NextResponse.json({
      message: "Files uploaded successfully",
      jobTitle,
      jobDesc,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      {
        message: "Error uploading files",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
