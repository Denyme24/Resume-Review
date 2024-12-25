"use client";
import React, { useEffect, useState } from "react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import Navbar from "@/components/navbar";

interface Result {
  name: string;
  email: string;
  similarity_score: number;
}

const ResultPage = () => {
  const [matchResult, setMatchResult] = useState<Result[] | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("http://localhost:8001/results/");
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setMatchResult(data.results);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  if (!matchResult) {
    return <div>No results available</div>;
  }

  // Sort the results by similarity score in descending order
  const sortedResults = [...matchResult].sort(
    (a, b) => b.similarity_score - a.similarity_score
  );

  return (
    <>
      <Navbar />
      <HeroHighlight>
        <div className="layout">This is the result page</div>
        <div>
          <h1>Shortlisted Resumes</h1>
          {sortedResults.map((result: Result, index: number) => (
            <div key={index}>
              <h2>{result.name}</h2>
              <p>Email: {result.email}</p>
              <p>Similarity Score: {result.similarity_score}</p>
            </div>
          ))}
        </div>
      </HeroHighlight>
    </>
  );
};

export default ResultPage;
