"use client";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FileUploadDemo } from "./file";
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
  const [jobTitle, setjobTitle] = useState("");
  const [jobDesc, setjobDesc] = useState("");
  const handlejobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setjobTitle(e.target.value);
  };
  const handlejobDesc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setjobDesc(e.target.value);
  };
  //   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     console.log("submitted");
  //   };
  return (
    // you can either make a form and operate on "onsubmit" action
    <div className="flex flex-col justify-center  items-center  px-4 w-[70vw] gap-5 mt-6">
      <h2>Please Enter Job Titles</h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handlejobChange}
      />
      <h2>Please Enter Job Description</h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholdersdesc}
        onChange={handlejobDesc}
      />
      <FileUploadDemo />
      <button
        type="submit"
        className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mt-[-10vh]"
      >
        Submit
      </button>
    </div>
  );
}
