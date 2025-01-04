"use client";
import { Logo } from "../shared/Logo";
import { AiOutlineHome } from "react-icons/ai";
import { BsPersonVcard } from "react-icons/bs";
import { BiLineChart } from "react-icons/bi";
import { FiGift } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function LeftSide() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-darkCharcoal flex flex-col gap-8 border-r border-darkGray/20 z-50
        transition-all duration-300 transform
        ${isOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"}
        lg:translate-x-0 lg:w-64`}
      >
        <div className="p-6 flex flex-col gap-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-darkCharcoal scrollbar-thumb-darkGray/20">
          {/* Header with Logo and Toggle */}
          <div className="flex items-center justify-between">
            <Logo />
            <button
              title="mobile menu toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-charcoal text-snow hover:bg-charcoal/80 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1 relative z-0">
            <NavItem
              icon={<AiOutlineHome size={18} />}
              label="Home"
              active={pathname === "/dashboard"}
              onClick={() => handleNavigation("/dashboard")}
            />
            <NavItem
              icon={<BsPersonVcard size={18} />}
              label="Account"
              active={pathname === "/dashboard/account"}
              onClick={() => handleNavigation("/dashboard/account")}
            />
            <NavItem
              icon={<BiLineChart size={18} />}
              label="Performance"
              active={pathname === "/dashboard/performance"}
              onClick={() => handleNavigation("/dashboard/performance")}
            />
            {/* <NavItem
              icon={<HiOutlineDocument size={18} />}
              label="Taxes & Documents"
              active={pathname === "/dashboard/documents"}
              onClick={() => handleNavigation("/dashboard/documents")}
            /> */}
          </nav>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-goldenrod to-goldenrod/80 hover:from-goldenrod/90 hover:to-goldenrod/70 text-charcoal text-sm font-medium transition-all duration-200 hover:-translate-y-0.5">
            Invest
          </button>

          <nav className="flex flex-col gap-1 mt-auto relative z-0">
            <NavItem
              icon={<FiGift size={18} />}
              label="Earn Rewards"
              onClick={() => handleNavigation("/dashboard/rewards")}
            />
            <NavItem
              icon={<BiSupport size={18} />}
              label="Support"
              onClick={() => handleNavigation("/dashboard/support")}
            />
            <div className="h-[1px] bg-darkGray/20 my-2"></div>
            <NavItem
              icon={<FiUser size={18} />}
              label="Ian"
              onClick={() => handleNavigation("/dashboard/profile")}
            />
          </nav>
        </div>
      </aside>

      {/* Mobile Toggle Button when sidebar is closed */}
      {!isOpen && (
        <button
          title="open mobile menu"
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-darkCharcoal text-snow hover:bg-darkCharcoal/90 transition-colors shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl w-full text-left transition-all duration-200
        ${
          active
            ? "bg-charcoal text-snow shadow-md"
            : "hover:bg-charcoal/50 text-lightGray hover:text-snow"
        }`}
    >
      <span className={`${active ? "text-snow" : "text-lightGray"}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
