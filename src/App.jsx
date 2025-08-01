import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./sections/Home.jsx";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setVisible(false), 1000); // optional: fully remove after fade
      }, 2000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-700 z-50${
          loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } ${visible ? "" : "hidden"}`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50" />
      </div>

      {/* Main App */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
