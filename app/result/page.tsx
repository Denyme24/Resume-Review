"use client";
import React, { useEffect, useState } from "react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import Navbar from "@/components/navbar";
import { CSSProperties } from "react";

interface Result {
  name: string;
  email: string;
  overall_score: number;
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
    alert("Don't refresh the page");
  }, []);

  // Sort the results by similarity score in descending order
  const sortedResults = matchResult
    ? [...matchResult].sort((a, b) => b.overall_score - a.overall_score)
    : [];

  return (
    <>
      <Navbar />
      <HeroHighlight>
        {sortedResults.length == 0 ? (
          <>
            <p>No Shortlisted Resume</p>
          </>
        ) : (
          <>
            <div className="layout-res w-[50vw] flex flex-col items-center px-0">
              <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
                    All Resumes With Scores
                  </h5>
                </div>
                <div className="flow-root max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    {sortedResults.map((result, index) => (
                      <li key={index} className="py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {result.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {result.email}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              Similarity Score: <b>{result.overall_score}</b>
                            </p>
                            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                              <div
                                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full progress-bar"
                                style={
                                  {
                                    width: `${Math.round(
                                      result.overall_score * 100
                                    )}%`,
                                    "--target-width": `${Math.round(
                                      result.overall_score * 100
                                    )}%`,
                                  } as CSSProperties
                                }
                              >
                                {Math.round(result.overall_score * 100)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </HeroHighlight>
      <style jsx>{`
        @keyframes progressAnimation {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }
        .progress-bar {
          animation: progressAnimation 2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default ResultPage;
