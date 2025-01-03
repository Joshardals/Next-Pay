"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { navigationLinks } from "@/lib/data";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

export function Header() {
  const [isMenuPOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="fixed top-0  max-w-7xl mx-auto  left-0 right-0 backdrop-blur-md bg-charcoal/90 px-4 sm:px-8 lg:px-20 py-6  flex items-center justify-between z-50">
      <Logo />

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden text-snow nav-links hover:text-goldenrod text-2xl"
        aria-label="Menu"
        onClick={() => setIsMenuOpen(!isMenuPOpen)}
      >
        {isMenuPOpen ? <IoMdClose /> : <RiMenu3Line />}
      </button>

      {/* Mobile Menu */}
      {isMenuPOpen && (
        <div className="bg-darkCharcoal text-snow  absolute -bottom-[24.5rem] left-0 w-full">
          <ul className="divide-y divide-darkGray/60 font-light">
            {navigationLinks.map((link) => (
              <li key={link.id}>
                <Link href={link.path} className="block w-full p-4">
                  {link.title}
                </Link>
              </li>
            ))}

            <li>
              <div className="flex justify-around py-8 px-4">
                <Link
                  href="/login"
                  className="text-center px-4 py-3 nav-links flex-1"
                  role="button"
                  aria-label="Log in to start investing"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="primary-btn flex flex-1 items-center justify-center"
                  role="button"
                  aria-label="Sign up to start investing"
                >
                  Sign up
                </Link>
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex text-lightGray items-center space-x-8">
        {navigationLinks.map((link) => (
          <li key={link.id} className="text-md nav-links hover:text-snow">
            <Link href={link.path} className="block">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden lg:flex space-x-5">
        <Link href="/login" className="hover:text-snow px-4 py-3 nav-links">
          Log in
        </Link>
        <Link href="/signup" className="primary-btn px-4 py-3">
          Sign up
        </Link>
      </div>
    </header>
  );
}
