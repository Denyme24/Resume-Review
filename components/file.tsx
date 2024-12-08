"use client";
import React from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadDemo() {
  //   const [files, setFiles] = useState<File[]>([]);
  //   const handleFileUpload = (files: File[]) => {
  //     setFiles(files);
  //     console.log(files);
  //   };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96   dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload />
    </div>
  );
}

// onChange={handleFileUpload
