// Enhanced SEO Implementation Examples
// These examples show how to use the improved SEO components

import React from "react";
import SEOHead from "../components/rusable/SEOHead";
import StructuredData from "../components/rusable/StructuredData";
import RobotsMeta from "../components/rusable/RobotsMeta";
import { useSEO } from "../hooks/useSEO";
import {
  generateWebsiteStructuredData,
  generateCourseStructuredData,
} from "../utils/structuredDataGenerators";

// Example 1: Using the useSEO hook (Recommended approach)
const HomeWithEnhancedSEO = () => {
  const seoData = useSEO("home");

  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      {/* Your existing Home component content */}
    </>
  );
};

// Example 2: Admin page with enhanced SEO
const AdminWithEnhancedSEO = () => {
  const seoData = useSEO("admin");

  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />{" "}
      {/* Admin pages shouldn't be indexed */}
      {/* Your existing Admin component content */}
    </>
  );
};

// Example 3: Lessons page with dynamic content
const LessonsWithEnhancedSEO = ({ lessonData }) => {
  const seoData = useSEO("lessons", {
    lessonData,
    title: `MH - ${lessonData?.title} | منصة مستر محمد حميدة`,
    description: `دروس ${lessonData?.title} في منصة مستر محمد حميدة للمرحلة الإعدادية والثانوية`,
  });

  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      {/* Your existing Lessons component content */}
    </>
  );
};

// Example 4: Exams page with enhanced SEO
const ExamsWithEnhancedSEO = ({ examData }) => {
  const seoData = useSEO("exams", {
    examData,
    title: `MH - امتحان ${examData?.title} | منصة مستر محمد حميدة`,
    description: `امتحان ${examData?.title} في منصة مستر محمد حميدة للمرحلة الإعدادية والثانوية`,
  });

  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      {/* Your existing Exams component content */}
    </>
  );
};

// Example 5: Manual SEO implementation (for more control)
const ManualSEOExample = ({ lessonData }) => {
  const baseUrl = window.location.origin;

  const seoProps = {
    title: `MH - ${lessonData?.title} | منصة مستر محمد حميدة`,
    description: `دروس ${lessonData?.title} في منصة مستر محمد حميدة`,
    keywords: `دروس, ${lessonData?.title}, مستر محمد حميدة, منصة, رياضيات`,
    author: "مستر محمد حميدة",
    robots: "index, follow",
    image: lessonData?.image || "/home/logo.png",
  };

  const structuredData = generateCourseStructuredData(lessonData, baseUrl);

  return (
    <>
      <SEOHead {...seoProps} />
      <StructuredData data={structuredData} />
      <RobotsMeta robots="index, follow" />
      {/* Your existing component content */}
    </>
  );
};

// Example 6: Academic Years page
const AcademicYearsWithEnhancedSEO = () => {
  const seoData = useSEO("academicYears");

  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      {/* Your existing AcademicYears component content */}
    </>
  );
};

// Example 7: User dashboard
const UserWithEnhancedSEO = () => {
  const seoData = useSEO("user");

  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />{" "}
      {/* User pages shouldn't be indexed */}
      {/* Your existing User component content */}
    </>
  );
};

export {
  HomeWithEnhancedSEO,
  AdminWithEnhancedSEO,
  LessonsWithEnhancedSEO,
  ExamsWithEnhancedSEO,
  ManualSEOExample,
  AcademicYearsWithEnhancedSEO,
  UserWithEnhancedSEO,
};
