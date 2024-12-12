"use client";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FileUpload } from "./ui/file-upload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
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
    "Identify vulnerabilities and implement measures to safeguard systems.",
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

  const validateFiles = (): string | null => {
    const validExtensions = [".pdf", ".docx"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      const extension = file.name.substring(file.name.lastIndexOf("."));
      if (!validExtensions.includes(extension)) {
        return `Invalid file format: ${
          file.name
        }. Allowed formats: ${validExtensions.join(", ")}`;
      }
      if (file.size > maxFileSize) {
        return `File size too large: ${file.name}. Max size is 5MB.`;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!jobTitle || !jobDesc || files.length === 0) {
      setErrorMessage(
        "Please fill all the fields and upload at least one file."
      );
      return;
    }

    const fileValidationError = validateFiles();
    if (fileValidationError) {
      setErrorMessage(fileValidationError);
      return;
    }

    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("jobTitle", jobTitle);
      formData.append("jobDesc", jobDesc);
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Form submitted", data);
      setJobTitle("");
      setJobDesc("");
      setFiles([]);
      toast("✅Resume Submitted!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error submitting form", error);
      setErrorMessage("An error occurred while submitting the form.");
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition: Bounce,
      />
      <div className="flex flex-col justify-center items-center px-4 w-[70vw] gap-5 mt-6">
        <h2>Please Enter Job Titles</h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          value={jobTitle}
          onChange={handleJobChange}
        />
        <h2>Please Enter Job Description</h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholdersdesc}
          value={jobDesc}
          onChange={handleJobDescChange}
        />
        <FileUpload onChange={handleFilesChange} />
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        >
          Submit
        </button>
      </div>
    </>
  );
}
