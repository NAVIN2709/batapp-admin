import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Courts", href: "/courts" },
    { label: "Timings", href: "/timings" },
    { label: "Bookings", href: "/bookings" },
  ];

  return (
    <nav className="w-full bg-white shadow-lg px-5 py-4 flex items-center justify-between border-b border-green-300/40 sticky top-0 z-50">
      {/* Logo */}
      <div>
        <img src={Logo} alt="Logo" className="w-12 h-12" />
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-10 text-lg">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded-xl transition font-medium ${
                isActive
                  ? "bg-green-300 text-black shadow-sm"
                  : "hover:bg-green-100 text-gray-700"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </div>

      {/* Burger / Close Icon */}
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} className="text-black" /> : <Menu size={28} className="text-black" />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-xl border-t border-green-300/40 flex flex-col p-4 md:hidden animate-fadeIn rounded-b-2xl">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`py-1 px-2 text-lg rounded-lg mb-1 transition ${
                  isActive
                    ? "bg-green-300 text-black"
                    : "hover:bg-green-100 text-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}