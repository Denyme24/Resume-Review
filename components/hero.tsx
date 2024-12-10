"use client";
import { motion } from "framer-motion";
import { HeroHighlight } from "./ui/hero-highlight";
import { Highlight } from "./ui/hero-highlight";
import Link from "next/link";
export function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        <div className="layout flex flex-col justify-center items-center gap-10">
          <div className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-relaxed text-center mx-auto mt-[-15vh] ">
            Elevate recruitment with automation and precision for
            <br />
            <Highlight className="text-black dark:text-white">
              smarter, faster, and effortless hiring.
            </Highlight>
          </div>
          <div className="buttons flex gap-4 justify-center items-center">
            {/* button for get started */}
            <Link href={"/getstarted"}>
              <button className="px-6 py-3 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                Get Started
              </button>
            </Link>
            {/* button for documentation -> not functional */}
            <button className="px-6 py-3 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              Documentation
            </button>
          </div>
        </div>
      </motion.h1>
    </HeroHighlight>
  );
}
