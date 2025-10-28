import { useEffect } from "react";

const RobotsMeta = ({ robots = "index, follow" }) => {
  useEffect(() => {
    // Update or create robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", robots);

    // Add sitemap reference if not exists
    const existingSitemap = document.querySelector('link[rel="sitemap"]');
    if (!existingSitemap) {
      const sitemapLink = document.createElement("link");
      sitemapLink.rel = "sitemap";
      sitemapLink.type = "application/xml";
      sitemapLink.href = "/sitemap.xml";
      document.head.appendChild(sitemapLink);
    }
  }, [robots]);

  return null; // This component doesn't render anything
};

export default RobotsMeta;
