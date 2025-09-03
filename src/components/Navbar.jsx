import React, { useState } from "react";
import { Menu } from "lucide-react";
import dropdown from "../assets/dropdown.png"
import snaphr from "../assets/snaphr.png"
import {Link} from "react-router-dom"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="p-4">
      <div className="pr-4 mx-auto flex justify-between items-center">
        <Link to="/">
        <img src={snaphr} className="h-10"/>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 font-inter text-sm">
          <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Dashboard</a>

          {/* Product Dropdown */}
          <div className="relative cursor-pointer">
            <a
              onClick={toggleDropdown}
              className="text-gray-600 hover:text-gray-800 hover:border-white select-none"
            >
              Products <img src={dropdown} className="w-2 inline-block"/>
            </a>
            {isDropdownOpen && (
              <div className="absolute  mt-2 w-auto text-sm font-inter bg-white border-[0.5px] border-gray-300 shadow-sm rounded-md z-10">
                <Link to="/bulk" className="block text-xs px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-violet-600 select-none whitespace-nowrap">
                Bulk Resume Analyzer 
                </Link>
                <hr className="w-40 m-auto"/>
                <Link to="/ask" className="block text-xs px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-violet-600 select-none whitespace-nowrap">
                Question Generator 
                </Link>
                <hr className="w-40 m-auto"/>
                <Link to="/interviewer" className="block text-xs px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-violet-600 select-none whitespace-nowrap">
                AI Interviewer 
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <div className="hidden md:flex md:gap-2">
          <button className="text-xs text-white bg-violet-500 border-violet font-bold hover:bg-violet-600 hover:border-black px-4 py-2 rounded whitespace-nowrap">
            Sign up
          </button>
          <button className="text-xs bg-white border-black font-bold hover:bg-gray-200 hover:border-black px-4 py-2 rounded whitespace-nowrap">
            Login
          </button>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none focus:border-violet">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4">
          <a href="#" className="block text-gray-600 hover:text-gray-800">About</a>
          <a href="#" className="block text-gray-600 hover:text-gray-800">For business</a>
          <a href="#" className="block text-gray-600 hover:text-gray-800">Media</a>
          <a href="#" className="block text-gray-600 hover:text-gray-800">Blog</a>

          {/* Product Dropdown in Mobile */}
          <div className="relative">
          <a
              onClick={toggleDropdown}
              className="text-gray-600 hover:text-gray-800 hover:border-white select-none"
            >
              Products <img src={dropdown} className="w-2 inline-block"/>
            </a>
            {isDropdownOpen && (
              <div className="mt-2 bg-white border border-gray-300 shadow-lg rounded-lg font-light text-sm">
                <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                  Bulk Resume Analyzer
                </a>
                <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                  Question Generator
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-row gap-2 m-auto w-full justify-center items-center">
          <button className="text-xs text-white bg-violet-500 border-violet font-bold hover:bg-violet-600 hover:border-black px-4 py-2 rounded whitespace-nowrap">
            Sign up
          </button>
          <button className="text-xs bg-white border-black font-bold hover:bg-gray-200 hover:border-black px-4 py-2 rounded whitespace-nowrap">
            Login
          </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
