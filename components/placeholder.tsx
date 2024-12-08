"use client";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FileUpload } from "./ui/file-upload";

export function Placeholders() {
  const placeholders = [
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Cloud Solutions Architect",
    "Cybersecurity Analyst",
  ];
  const placeholdersdesc = [
    "Develop front-end interfaces and back-end systems for web applications.",
    "Manage CI/CD pipelines and automate software deployment processes",
    "Extract insights from data using machine learning and statistical analysis",
    "Design and implement secure, scalable cloud-based infrastructures",
    " Identify vulnerabilities and implement measures to safeguard systems.",
  ];

  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
  };

  const handleJobDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobDesc(e.target.value);
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSubmit = () => {
    if (!jobTitle || !jobDesc || files.length === 0) {
      setErrorMessage("Please fill all the fields and upload a file.");
    } else {
      setErrorMessage("");
      // Proceed with form submission or other logic
      console.log("Form submitted");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 w-[70vw] gap-5 mt-6">
      <h2>Please Enter Job Titles</h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleJobChange}
      />
      <h2>Please Enter Job Description</h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholdersdesc}
        onChange={handleJobDescChange}
      />
      <FileUpload onChange={handleFilesChange} />
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <button
        type="button"
        onClick={handleSubmit}
        className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
      >
        Submit
      </button>
    </div>
  );
}
