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
          <div className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto mt-[-30vh] ">
            Elevate recruitment with automation and precision for
            <br />
            <Highlight className="text-black dark:text-white">
              smarter, faster, and effortless hiring.
            </Highlight>
          </div>
          <div className="buttons flex gap-4 justify-center items-center">
            {/* button for get started */}
            <Link href={"/getstarted"}>
              <button className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                  Get Started
                </div>
                {/* button for documentation -> not functional */}
              </button>
            </Link>
            <button className="p-[3px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                Documentation
              </div>
            </button>
          </div>
        </div>
      </motion.h1>
    </HeroHighlight>
  );
}
