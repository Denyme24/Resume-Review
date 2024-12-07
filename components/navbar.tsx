import React from "react";
import Link from "next/link";
const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 right-[56vh] w-[40vw] h-[7vh] p-3 rounded-full border-[2px] bg-white/30 backdrop-blur-md mt-1 border-indigo-500 z-[1000]">
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
