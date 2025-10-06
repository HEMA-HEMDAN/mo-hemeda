import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import Switch from "./Switch";

const Navbar = () => {
  // the logic of the navbar is done for now the dashboard checkout the role and redirect the the right page
  const [isDark, setIsDark] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // ========== theme tuggle =========== //
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
  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = isDark ? "light" : "dark";

    root.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("");
    navigate("/");
  };

  // Close mobile menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMenuOpen) return;
      const target = event.target;
      const clickedInsideMenu =
        menuRef.current && menuRef.current.contains(target);
      const clickedToggle =
        toggleButtonRef.current && toggleButtonRef.current.contains(target);
      if (!clickedInsideMenu && !clickedToggle) {
        setIsMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  return (
    <nav
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

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-4">
        <Switch isDark={isDark} toggleTheme={toggleTheme} />

        <p className="text-white text-sm md:text-lg font-bold">
          {isDark ? "dark" : "light"}
        </p>

        {!token && (
          <div className="flex items-center gap-2">
            <Link
              to="/auth?tab=login"
              className="text-white font-semibold border border-white/40 px-3 py-1 rounded hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/auth?tab=register"
              className="text-white font-semibold border border-white/40 px-3 py-1 rounded hover:bg-white/10"
            >
              Register
            </Link>
          </div>
        )}

        {token && (
          <div className="flex items-center gap-2">
            {role === "admin" ? (
              <Link
                onClick={() => setIsMenuOpen(false)}
                to="/admin"
                className="text-white font-semibold border border-white/40 px-3 py-2 rounded hover:bg-white/10"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                onClick={() => setIsMenuOpen(false)}
                to="/user"
                className="text-white font-semibold border border-white/40 px-3 py-2 rounded hover:bg-white/10"
              >
                Profile
              </Link>
            )}
            <button
              onClick={logout}
              className="text-white font-semibold border border-white/40 px-3 py-1 rounded hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile toggle button */}
      <button
        ref={toggleButtonRef}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        className="md:hidden inline-flex items-center justify-center p-2 rounded border border-white/40 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="absolute top-full right-2 mt-2 w-60 rounded-md shadow-lg bg-[#095259]/95 backdrop-blur border border-white/20 p-3 md:hidden"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <Switch isDark={isDark} toggleTheme={toggleTheme} />
            <p className="text-white text-sm font-bold">
              {isDark ? "dark" : "light"}
            </p>
          </div>

          {!token && (
            <div className="flex flex-col gap-2">
              <Link
                onClick={() => setIsMenuOpen(false)}
                to="/auth?tab=login"
                className="text-white font-semibold border border-white/40 px-3 py-2 rounded hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                to="/auth?tab=register"
                className="text-white font-semibold border border-white/40 px-3 py-2 rounded hover:bg-white/10"
              >
                Register
              </Link>
            </div>
          )}

          {token && (
            <div className="flex flex-col gap-2">
              {role === "admin" ? (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/admin"
                  className="text-white font-semibold border border-white/40 px-3 py-2 rounded hover:bg-white/10"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/user"
                  className="text-white font-semibold border border-white/40 px-3 py-2 rounded hover:bg-white/10"
                >
                  Profile
                </Link>
              )}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="text-left text-white font-semibold border border-white/40 px-3 py-2 rounded hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
