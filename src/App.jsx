import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./sections/Home.jsx";
import GradeDetial from "./sections/GradeDetail.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import NotFound from "./sections/NotFound.jsx";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setVisible(false), 1000); // optional: fully remove after fade
      }, 1000);
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
        className={`fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-700 ${
          loading
            ? "opacity-100 pointer-events-auto z-50"
            : "opacity-0 pointer-events-none"
        } ${visible ? "" : "hidden"}`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50" />
      </div>

      {/* Main App */}
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grades/:params" element={<GradeDetial />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
