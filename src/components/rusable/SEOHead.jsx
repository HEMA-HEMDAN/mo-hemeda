import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SEOHead = ({
  title = "MH - منصة مستر محمد حميدة",
  description = "منصة مستر محمد حميدة المعلم الأول، أستاذ الرياضيات لطلاب الاعداديه والثانويه العامه المصرية",
  keywords = "مستر محمد حميدة, أستاذ محمد حميدة, منصة محمد حميدة, منصة مستر محمد حميدة, تحمد حميدة, المعلم الأول,محمد حميدة,رياضيات,مادة الرياضيات,منصة استاذ محمد حميدة, Mr Mohamed Hemeda, Mr Mohamed Hameda, Mohamed Hemeda, Mohamed Hameda ,over-dose-math",
  image = "/home/logo.png",
  type = "website",
  author = "مستر محمد حميدة",
  robots = "index, follow",
  jsonLd = null,
}) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}${location.pathname}${location.search}`;

    // Update or create title
    document.title = title;

    // Update or create meta description
    updateMetaTag("description", description);

    // Update or create meta keywords
    updateMetaTag("keywords", keywords);

    // Update or create author meta tag
    updateMetaTag("author", author);

    // Update or create robots meta tag
    updateMetaTag("robots", robots);

    // Update or create viewport meta tag (if not exists)
    updateMetaTag("viewport", "width=device-width, initial-scale=1.0");

    // Update or create language meta tag
    updateMetaTag("language", "ar, en");

    // Update or create Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", `${baseUrl}${image}`, "property");
    updateMetaTag("og:url", currentUrl, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:site_name", "منصة مستر محمد حميدة", "property");
    updateMetaTag("og:locale", "ar_EG", "property");

    // Update or create Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", title, "name");
    updateMetaTag("twitter:description", description, "name");
    updateMetaTag("twitter:image", `${baseUrl}${image}`, "name");
    updateMetaTag("twitter:site", "@mohamed_hemeda", "name");

    // Update or create canonical link
    updateCanonicalLink(currentUrl);

    // Add JSON-LD structured data if provided
    if (jsonLd) {
      addJsonLd(jsonLd);
    }
  }, [
    location.pathname,
    location.search,
    title,
    description,
    keywords,
    image,
    type,
    author,
    robots,
    jsonLd,
  ]);

  const updateMetaTag = (name, content, attribute = "name") => {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  const updateCanonicalLink = (url) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  };

  const addJsonLd = (data) => {
    // Remove existing JSON-LD if any
    const existingJsonLd = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    // Create new JSON-LD script
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything
};

export default SEOHead;
