import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobTitle = formData.get("jobTitle");
    const jobDesc = formData.get("jobDesc");
    const files = formData.getAll("files");

    console.log(jobTitle, jobDesc, files);
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error", error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
