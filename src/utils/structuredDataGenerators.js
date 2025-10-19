// Structured Data Generators for MH Educational Platform
// These help search engines understand your content better

export const generateWebsiteStructuredData = (baseUrl) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "منصة مستر محمد حميدة",
  alternateName: "MH Platform",
  description:
    "منصة مستر محمد حميدة المعلم الأول، أستاذ الرياضيات لطلاب الاعداديه والثانويه العامه المصرية",
  url: baseUrl,
  logo: `${baseUrl}/home/logo.png`,
  image: `${baseUrl}/home/logo.png`,
  founder: {
    "@type": "Person",
    name: "مستر محمد حميدة",
    alternateName: "Mr Mohamed Hemeda",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "EG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: [
    // Add your social media URLs here
    // "https://facebook.com/yourpage",
    // "https://twitter.com/yourhandle",
    // "https://instagram.com/yourhandle"
  ],
});

export const generateCourseStructuredData = (courseData, baseUrl) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: courseData.title,
  description:
    courseData.description ||
    `دروس ${courseData.title} في منصة مستر محمد حميدة`,
  provider: {
    "@type": "EducationalOrganization",
    name: "منصة مستر محمد حميدة",
    url: baseUrl,
  },
  instructor: {
    "@type": "Person",
    name: "مستر محمد حميدة",
  },
  courseMode: "online",
  educationalLevel: courseData.level || "Secondary Education",
  inLanguage: "ar",
  url: `${baseUrl}/lessons/${courseData.id}`,
  image: courseData.image
    ? `${baseUrl}${courseData.image}`
    : `${baseUrl}/home/logo.png`,
});

export const generateExamStructuredData = (examData, baseUrl) => ({
  "@context": "https://schema.org",
  "@type": "Assessment",
  name: examData.title,
  description:
    examData.description || `امتحان ${examData.title} في منصة مستر محمد حميدة`,
  assesses: examData.subject || "الرياضيات",
  educationalLevel: examData.level || "Secondary Education",
  inLanguage: "ar",
  timeRequired: examData.duration || "PT60M", // 60 minutes in ISO 8601 format
  url: `${baseUrl}/exams/${examData.id}`,
  provider: {
    "@type": "EducationalOrganization",
    name: "منصة مستر محمد حميدة",
    url: baseUrl,
  },
});

export const generateBreadcrumbStructuredData = (breadcrumbs, baseUrl) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `${baseUrl}${crumb.url}`,
  })),
});

export const generateFAQStructuredData = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const generatePersonStructuredData = (baseUrl) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "مستر محمد حميدة",
  alternateName: "Mr Mohamed Hemeda",
  jobTitle: "معلم الرياضيات",
  description: "معلم الرياضيات للمرحلة الإعدادية والثانوية العامة المصرية",
  url: baseUrl,
  image: `${baseUrl}/home/logo.png`,
  knowsAbout: [
    "الرياضيات",
    "المرحلة الإعدادية",
    "الثانوية العامة",
    "التعليم الإلكتروني",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "جامعة مصرية",
  },
});

// Helper function to generate breadcrumbs for different pages
export const generateBreadcrumbs = (pathname) => {
  const baseUrl = window.location.origin;
  const breadcrumbs = [{ name: "الرئيسية", url: "/" }];

  const pathSegments = pathname.split("/").filter((segment) => segment);

  if (pathSegments.includes("admin")) {
    breadcrumbs.push({ name: "لوحة التحكم", url: "/admin" });

    if (pathSegments.includes("users")) {
      breadcrumbs.push({ name: "المستخدمين", url: "/admin/users" });
    } else if (pathSegments.includes("academic-years")) {
      breadcrumbs.push({
        name: "السنوات الأكاديمية",
        url: "/admin/academic-years",
      });
    } else if (pathSegments.includes("lessons")) {
      breadcrumbs.push({ name: "الدروس", url: "/admin/lessons" });
    } else if (pathSegments.includes("exams")) {
      breadcrumbs.push({ name: "الامتحانات", url: "/admin/exams" });
    }
  } else if (pathSegments.includes("user")) {
    breadcrumbs.push({ name: "لوحة الطالب", url: "/user" });
  } else if (pathSegments.includes("academic-years")) {
    breadcrumbs.push({ name: "السنوات الأكاديمية", url: "/academic-years" });
  } else if (pathSegments.includes("lessons")) {
    breadcrumbs.push({ name: "الدروس", url: "/lessons" });
  } else if (pathSegments.includes("exams")) {
    breadcrumbs.push({ name: "الامتحانات", url: "/exams" });
  }

  return breadcrumbs;
};
