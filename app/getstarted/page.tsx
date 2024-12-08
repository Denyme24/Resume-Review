import React from "react";
import Navbar from "@/components/navbar";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { Placeholders } from "@/components/placeholder";

const page = () => {
  return (
    <>
      <Navbar />
      <HeroHighlight>
        <div className="input-field md:mt-[8vh]">
          <Placeholders />
        </div>
      </HeroHighlight>
    </>
  );
};

export default page;
