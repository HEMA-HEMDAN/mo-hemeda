// components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on path change
    window.scrollTo(0, 0);

    // Add event listener to scroll to top on page reload
    window.addEventListener("beforeunload", () => {
      window.scrollTo(0, 0);
    });

    // Remove event listener when component is unmounted
    return () => {
      window.removeEventListener("beforeunload", () => {
        window.scrollTo(0, 0);
      });
    };
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;

