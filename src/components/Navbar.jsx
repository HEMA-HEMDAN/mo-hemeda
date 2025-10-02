import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Switch from "./Switch";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = isDark ? "light" : "dark";

    root.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  useGSAP(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -50, delay: 2 },
        { opacity: 1, y: 0, duration: 2, ease: "power1.inOut" }
      );
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("");
    navigate("/");
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0  px-4 py-2  flex justify-between items-center z-40
                 bg-gradient-to-b 
    from-[#0F818C] 
    via-[#095259] 
    via-64% 
    to-[#042326]"
    >
      {/* Logo */}
      <Link to="/" className="text-white text-2xl flex flex-row items-center">
        <img
          src="/home/face.png"
          className="w-10 md:w-16 object-contain"
          alt="logo"
        />
        <div className="w-[2px] md:w-1 md:h-12 h-8 bg-white"></div>
        <div className="text-center ml-2 text-white text-[10px] md:text-sm font-bold">
          <p>over dose</p>
          <p>math</p>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <Switch isDark={isDark} toggleTheme={toggleTheme} />

        <p className="text-white text-sm md:text-lg font-bold">
          {isDark ? "dark" : "light"}
        </p>

        {!token && (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-white font-semibold border border-white/40 px-3 py-1 rounded hover:bg-white/10">Login</Link>
            <Link to="/register" className="text-white font-semibold border border-white/40 px-3 py-1 rounded hover:bg-white/10">Register</Link>
          </div>
        )}

        {token && (
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <Link to="/admin" className="text-white font-semibold border border-white/40 px-3 py-1 rounded hover:bg-white/10">Dashboard</Link>
            )}
            <button onClick={logout} className="text-white font-semibold border border-white/40 px-3 py-1 rounded hover:bg-white/10">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
