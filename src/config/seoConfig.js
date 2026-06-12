// SEO Configuration for MH Platform
// You can customize these settings for better SEO

export const seoConfig = {
  // Base URL for your website (replace with your actual domain)
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://your-domain.com" // Replace with your actual domain
      : "http://localhost:5173",

  // Default SEO settings
  default: {
    title: "MH - منصة مستر محمد حميدة",
    description:
      "منصة مستر محمد حميدة المعلم الأول، أستاذ الرياضيات لطلاب الاعداديه والثانويه العامه المصرية",
    keywords:
      "مستر محمد حميدة, أستاذ محمد حميدة, منصة محمد حميدة, منصة مستر محمد حميدة, تحمد حميدة, المعلم الأول,محمد حميدة,رياضيات,مادة الرياضيات,منصة استاذ محمد حميدة, Mr Mohamed Hemeda, Mr Mohamed Hameda, Mohamed Hemeda, Mohamed Hameda ,over-dose-math",
    image: "/home/logo.png",
    type: "website",
    author: "مستر محمد حميدة",
    robots: "index, follow",
    language: "ar, en",
    locale: "ar_EG",
  },

  // Page-specific SEO settings
  pages: {
    home: {
      title: "MH - منصة مستر محمد حميدة | الصفحة الرئيسية",
      description:
        "منصة مستر محمد حميدة المعلم الأول، أستاذ الرياضيات لطلاب الاعداديه والثانويه العامه المصرية",
      keywords:
        "مستر محمد حميدة, أستاذ محمد حميدة, منصة محمد حميدة, رياضيات, الاعداديه, الثانويه العامه",
    },

    auth: {
      title: "MH - تسجيل الدخول | منصة مستر محمد حميدة",
      description: "تسجيل الدخول إلى منصة مستر محمد حميدة للطلاب والمعلمين",
      keywords: "تسجيل الدخول, مستر محمد حميدة, منصة, طلاب, معلمين",
    },

    admin: {
      title: "MH - لوحة التحكم | منصة مستر محمد حميدة",
      description: "لوحة تحكم منصة مستر محمد حميدة لإدارة المحتوى والطلاب",
      keywords: "لوحة التحكم, إدارة, مستر محمد حميدة, منصة",
    },

    user: {
      title: "MH - لوحة الطالب | منصة مستر محمد حميدة",
      description:
        "لوحة الطالب في منصة مستر محمد حميدة للوصول إلى الدروس والامتحانات",
      keywords: "لوحة الطالب, دروس, امتحانات, مستر محمد حميدة",
    },

    academicYears: {
      title: "MH - السنوات الأكاديمية | منصة مستر محمد حميدة",
      description: "تصفح السنوات الأكاديمية المتاحة في منصة مستر محمد حميدة",
      keywords: "السنوات الأكاديمية, مستر محمد حميدة, منصة, دروس",
    },

    lessons: {
      title: "MH - الدروس | منصة مستر محمد حميدة",
      description:
        "دروس الرياضيات في منصة مستر محمد حميدة للمرحلة الإعدادية والثانوية",
      keywords: "دروس, رياضيات, مستر محمد حميدة, منصة, الاعداديه, الثانويه",
    },

    exams: {
      title: "MH - الامتحانات | منصة مستر محمد حميدة",
      description:
        "امتحانات الرياضيات في منصة مستر محمد حميدة للمرحلة الإعدادية والثانوية",
      keywords: "امتحانات, رياضيات, مستر محمد حميدة, منصة, الاعداديه, الثانويه",
    },

    results: {
      title: "MH - النتائج | منصة مستر محمد حميدة",
      description: "نتائج الامتحانات في منصة مستر محمد حميدة",
      keywords: "نتائج, امتحانات, مستر محمد حميدة, منصة",
    },
  },

  // Dynamic SEO generators
  generateAcademicYearSEO: (yearTitle) => ({
    title: `MH - ${yearTitle} | منصة مستر محمد حميدة`,
    description: `دروس وامتحانات ${yearTitle} في منصة مستر محمد حميدة للمرحلة الإعدادية والثانوية`,
    keywords: `دروس, امتحانات, ${yearTitle}, مستر محمد حميدة, منصة, رياضيات`,
  }),

  generateLessonSEO: (lessonTitle, academicYear) => ({
    title: `MH - ${lessonTitle} | ${academicYear} | منصة مستر محمد حميدة`,
    description: `دروس ${lessonTitle} للعام الدراسي ${academicYear} في منصة مستر محمد حميدة`,
    keywords: `دروس, ${lessonTitle}, ${academicYear}, مستر محمد حميدة, منصة, رياضيات`,
  }),

  generateExamSEO: (examTitle, lessonTitle) => ({
    title: `MH - امتحان ${examTitle} | ${lessonTitle} | منصة مستر محمد حميدة`,
    description: `امتحان ${examTitle} في مادة ${lessonTitle} في منصة مستر محمد حميدة`,
    keywords: `امتحان, ${examTitle}, ${lessonTitle}, مستر محمد حميدة, منصة, رياضيات`,
  }),
};

// Helper function to get canonical URL
export const getCanonicalUrl = (path = "") => {
  return `${seoConfig.baseUrl}${path}`;
};

// Helper function to get page SEO data
export const getPageSEO = (pageName, dynamicData = {}) => {
  const pageConfig = seoConfig.pages[pageName] || seoConfig.default;

  if (dynamicData.academicYear && pageName === "lessons") {
    return seoConfig.generateLessonSEO(
      dynamicData.lessonTitle,
      dynamicData.academicYear
    );
  }

  if (dynamicData.lessonTitle && pageName === "exams") {
    return seoConfig.generateExamSEO(
      dynamicData.examTitle,
      dynamicData.lessonTitle
    );
  }

  if (dynamicData.yearTitle && pageName === "academicYears") {
    return seoConfig.generateAcademicYearSEO(dynamicData.yearTitle);
  }

  return pageConfig;
};
