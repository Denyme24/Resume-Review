import React from "react";
import Link from "next/link";
const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 left-[3vh] md:right-[45vh] md:left-auto width-[100vw] md:w-[50vw] h-[7vh] p-3 rounded-full border-[2px] bg-white/30 backdrop-blur-md mt-1 border-black z-[1000]">
        <ul className="flex justify-evenly items-center gap-8 cursor-pointer">
          <Link href={"/"}>
            <li>Home</li>
          </Link>
          <li>Contact Us</li>
          <li>Services</li>
          <li>Products</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
