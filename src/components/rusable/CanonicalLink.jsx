import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CanonicalLink = () => {
  const location = useLocation();

  useEffect(() => {
    // Remove existing canonical link if any
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Create new canonical link
    const canonical = document.createElement("link");
    canonical.rel = "canonical";

    // Get the current domain (you can replace this with your actual domain)
    const baseUrl = window.location.origin;
    // Include query parameters for better SEO
    const canonicalUrl = `${baseUrl}${location.pathname}${location.search}`;

    canonical.href = canonicalUrl;

    // Add to head
    document.head.appendChild(canonical);

    // Cleanup function
    return () => {
      if (canonical && canonical.parentNode) {
        canonical.parentNode.removeChild(canonical);
      }
    };
  }, [location.pathname, location.search]);

  return null; // This component doesn't render anything
};

export default CanonicalLink;
