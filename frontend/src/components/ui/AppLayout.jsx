import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import NavbarHome from "./NavbarHome";

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {isHomePage ? <NavbarHome /> : <Navbar />}
      <main className=" px-4 sm:px-6">{children}</main>
    </div>
  );
}