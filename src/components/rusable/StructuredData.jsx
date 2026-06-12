import { useEffect } from "react";

const StructuredData = ({ data }) => {
  useEffect(() => {
    if (!data) return;

    // Remove existing structured data if any
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Create new structured data script
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [data]);

  return null; // This component doesn't render anything
};

export default StructuredData;
