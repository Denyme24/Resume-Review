"use client";
import React from "react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

const Shortlist = () => {
  const router = useRouter();

  const proceedFurther = async () => {
    const response = await fetch("/api/upload");
    const result = await response.json();
    const jobDesc = result.fields.jobDesc[0];
    const resumeData = result.structuredData; //structured resume data

    resumeData.forEach((resume, index) => {
      console.log(`Resume ${index + 1} Data:`, JSON.stringify(resume, null, 2));
    });

    const response1 = await fetch(
      "http://localhost:8000/parse-job-description",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: jobDesc }),
      }
    );

    const parsedData = await response1.json(); //structured job description
    console.log(parsedData);

    const response2 = await fetch("http://localhost:8001/compare/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jdData: JSON.stringify(parsedData), // Convert jdData to a string
        resumes: resumeData, // Send resumeData as a list of Resume objects
      }),
    });

    const matchResult = await response2.json();
    console.log(matchResult);

    router.push("/result");
  };

  return (
    <>
      <Navbar />
      <HeroHighlight>
        <div className="container mx-auto text-center text-2xl leading-relaxed flex flex-col justify-center items-center gap-3">
          <div className="greetings">
            Thank You !
            <br />
            We have received your uploaded resumes and will shortlist the best
            resumes for you.
          </div>
          <div className="button">
            <button
              type="button"
              onClick={proceedFurther}
              className="px-6 py-4 rounded-md border border-black bg-white text-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              Proceed Further
            </button>
          </div>
        </div>
      </HeroHighlight>
    </>
  );
};

export default Shortlist;
