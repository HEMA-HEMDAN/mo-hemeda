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
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-3 md:mx-6 my-2 rounded-2xl bg-gray-200/80 dark:bg-[#121821] backdrop-blur border border-black/5 dark:border-white/10 px-3 md:px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Left: Brand */}
          <Link to="/" className="flex flex-row items-center">
            <img src="/home/face.png" className="w-10 md:w-12 object-contain" alt="logo" />
            <div className="w-[2px] md:w-1 md:h-10 h-8 bg-[#1b232e] dark:bg-white mx-2"></div>
            <div className="text-center text-[#1b232e] dark:text-white text-[10px] md:text-sm font-bold">
              <p>over dose</p>
              <p>math</p>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle wrapped in a small capsule */}
            <div className="rounded-full bg-[#c5f10f]/90 p-1">
              <Switch isDark={isDark} toggleTheme={toggleTheme} />
            </div>
            <span className="text-[#1b232e] dark:text-gray-200 text-sm font-bold">
              {isDark ? "Dark mode" : "Light mode"}
            </span>

            {!token && (
              <div className="flex items-center gap-2">
                 <Link
                  to="/auth?tab=login"
                  className="font-semibold rounded-lg px-4 py-2 border border-[#1b232e] text-[#1b232e] hover:bg-[#1b232e]/10 transition dark:text-[#c5f10f] dark:border-[#c5f10f]"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="font-semibold rounded-lg px-4 py-2 bg-[#1b232e] text-[#c5f10f] hover:opacity-90 transition dark:text-[#1b232e] dark:bg-[#c5f10f]"
                >
                  Sign up
                </Link>
               
              </div>
            )}

            {token && (
              <div className="flex items-center gap-2">
                {role === "admin" ? (
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    to="/admin"
                    className="font-semibold rounded-lg px-4 py-2 border border-[#1b232e] text-[#1b232e] hover:bg-[#1b232e]/10 transition dark:text-[#c5f10f] dark:border-[#c5f10f]"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    to="/user"
                    className="font-semibold rounded-lg px-4 py-2 border border-[#1b232e] text-[#1b232e] hover:bg-[#1b232e]/10 transition dark:text-[#c5f10f] dark:border-[#c5f10f]"
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="font-semibold rounded-lg px-4 py-2 bg-[#1b232e] text-[#c5f10f] hover:opacity-90 transition dark:text-[#1b232e] dark:bg-[#c5f10f]"
                >
                  Log out
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
            className="md:hidden inline-flex items-center justify-center p-2 rounded border border-[#1b232e]/30 text-[#1b232e] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#c5f10f]/50"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            id="mobile-menu"
            className="md:hidden mt-2 rounded-2xl shadow-2xl bg-gray-100/95 dark:bg-[#121821]/95 backdrop-blur border border-black/5 dark:border-white/10 p-4"
          >
            {/* Theme */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10">
              <p className="text-[#1b232e] dark:text-gray-200 text-sm font-semibold">Appearance</p>
              <div className="rounded-full bg-transparent p-0 md:bg-[#c5f10f]/90 md:p-1">
                <Switch isDark={isDark} toggleTheme={toggleTheme} />
              </div>
            </div>

            {!token && (
              <div className="flex flex-col gap-3 pt-3">
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/auth?tab=login"
                  className="w-full text-center font-semibold rounded-full px-4 py-3 border border-[#1b232e] text-[#1b232e] hover:bg-[#1b232e]/10 transition dark:text-[#c5f10f] dark:border-[#c5f10f]"
                >
                  Log in
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/auth?tab=register"
                  className="w-full text-center font-semibold rounded-full px-4 py-3 bg-[#1b232e] text-[#c5f10f] hover:opacity-90 transition dark:text-[#1b232e] dark:bg-[#c5f10f]"
                >
                  Sign up
                </Link>
              </div>
            )}

            {token && (
              <div className="flex flex-col gap-3 pt-3">
                {role === "admin" ? (
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    to="/admin"
                    className="w-full text-center font-semibold rounded-full px-4 py-3 border border-[#1b232e] text-[#1b232e] hover:bg-[#1b232e]/10 transition dark:text-[#c5f10f] dark:border-[#c5f10f]"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    to="/user"
                    className="w-full text-center font-semibold rounded-full px-4 py-3 border border-[#1b232e] text-[#1b232e] hover:bg-[#1b232e]/10 transition dark:text-[#c5f10f] dark:border-[#c5f10f]"
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="font-semibold rounded-lg px-4 py-2 bg-[#1b232e] text-[#c5f10f] hover:opacity-90 transition dark:text-[#1b232e] dark:bg-[#c5f10f]"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
