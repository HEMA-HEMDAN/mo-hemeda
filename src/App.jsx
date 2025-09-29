import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./sections/Home.jsx";
import GradeDetial from "./sections/GradeDetail.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import NotFound from "./sections/NotFound.jsx";
import ExamComponent from "./components/Exams.jsx";
import { exam1, exam2, exam3 } from "./const/exams";
import Login from "./sections/Login.jsx";
import Register from "./sections/Register.jsx";

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
          <Route
            path="/grades/:params"
            element={<GradeDetial id1={exam1} id2={exam2} id3={exam3} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/exam1"
            element={
              <div className="min-h-screen w-full mt-20 md:mt-30">
                <ExamComponent questionsData={exam1.questions} />
              </div>
            }
          />
          <Route
            path="/exam2"
            element={
              <div className="min-h-screen w-full mt-20 md:mt-30">
                <ExamComponent questionsData={exam2.questions} />
              </div>
            }
          />{" "}
          <Route
            path="/exam3"
            element={
              <div className="min-h-screen w-full mt-20 md:mt-30">
                <ExamComponent questionsData={exam3.questions} />
              </div>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
