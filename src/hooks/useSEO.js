import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { seoConfig } from "../config/seoConfig";
import {
  generateWebsiteStructuredData,
  generateCourseStructuredData,
  generateExamStructuredData,
  generateBreadcrumbStructuredData,
  generatePersonStructuredData,
  generateBreadcrumbs,
} from "../utils/structuredDataGenerators";

export const useSEO = (pageName, customData = {}) => {
  const location = useLocation();

  const seoData = useMemo(() => {
    const baseUrl = seoConfig.baseUrl;
    const pageConfig = seoConfig.pages[pageName] || seoConfig.default;

    // Merge default config with page-specific config and custom data
    const mergedConfig = {
      ...seoConfig.default,
      ...pageConfig,
      ...customData,
    };

    // Generate structured data based on page type
    let structuredData = null;

    switch (pageName) {
      case "home":
        structuredData = generateWebsiteStructuredData(baseUrl);
        break;
      case "lessons":
        if (customData.lessonData) {
          structuredData = generateCourseStructuredData(
            customData.lessonData,
            baseUrl
          );
        }
        break;
      case "exams":
        if (customData.examData) {
          structuredData = generateExamStructuredData(
            customData.examData,
            baseUrl
          );
        }
        break;
      case "admin":
      case "user":
        structuredData = generatePersonStructuredData(baseUrl);
        break;
      default:
        // Generate breadcrumb structured data for most pages
        const breadcrumbs = generateBreadcrumbs(location.pathname);
        if (breadcrumbs.length > 1) {
          structuredData = generateBreadcrumbStructuredData(
            breadcrumbs,
            baseUrl
          );
        }
    }

    return {
      ...mergedConfig,
      structuredData,
      canonicalUrl: `${baseUrl}${location.pathname}${location.search}`,
    };
  }, [pageName, customData, location.pathname, location.search]);

  return seoData;
};

export default useSEO;
