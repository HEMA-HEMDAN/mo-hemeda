// Example of how to use SEO components in your existing pages
// You can add these to your existing components without editing your current code

import SEOHead from "../components/rusable/SEOHead";

// Example 1: For Home page
const HomeWithSEO = () => {
  return (
    <>
      <SEOHead
        title="MH - منصة مستر محمد حميدة | الصفحة الرئيسية"
        description="منصة مستر محمد حميدة المعلم الأول، أستاذ الرياضيات لطلاب الاعداديه والثانويه العامه المصرية"
        keywords="مستر محمد حميدة, أستاذ محمد حميدة, منصة محمد حميدة, رياضيات, الاعداديه, الثانويه العامه"
      />
      {/* Your existing Home component content */}
    </>
  );
};

// Example 2: For Admin pages
const AdminWithSEO = () => {
  return (
    <>
      <SEOHead
        title="MH - لوحة التحكم | منصة مستر محمد حميدة"
        description="لوحة تحكم منصة مستر محمد حميدة لإدارة المحتوى والطلاب"
        keywords="لوحة التحكم, إدارة, مستر محمد حميدة, منصة"
        type="website"
      />
      {/* Your existing Admin component content */}
    </>
  );
};

// Example 3: For User pages
const UserWithSEO = () => {
  return (
    <>
      <SEOHead
        title="MH - لوحة الطالب | منصة مستر محمد حميدة"
        description="لوحة الطالب في منصة مستر محمد حميدة للوصول إلى الدروس والامتحانات"
        keywords="لوحة الطالب, دروس, امتحانات, مستر محمد حميدة"
        type="website"
      />
      {/* Your existing User component content */}
    </>
  );
};

// Example 4: For Academic Years page
const AcademicYearsWithSEO = () => {
  return (
    <>
      <SEOHead
        title="MH - السنوات الأكاديمية | منصة مستر محمد حميدة"
        description="تصفح السنوات الأكاديمية المتاحة في منصة مستر محمد حميدة"
        keywords="السنوات الأكاديمية, مستر محمد حميدة, منصة, دروس"
        type="website"
      />
      {/* Your existing AcademicYears component content */}
    </>
  );
};

// Example 5: For Lessons page with dynamic content
const LessonsWithSEO = ({ academicYearTitle }) => {
  return (
    <>
      <SEOHead
        title={`MH - دروس ${academicYearTitle} | منصة مستر محمد حميدة`}
        description={`دروس ${academicYearTitle} في منصة مستر محمد حميدة للمرحلة الإعدادية والثانوية`}
        keywords={`دروس, ${academicYearTitle}, مستر محمد حميدة, منصة, رياضيات`}
        type="website"
      />
      {/* Your existing Lessons component content */}
    </>
  );
};

// Example 6: For Exams page with dynamic content
const ExamsWithSEO = ({ lessonTitle }) => {
  return (
    <>
      <SEOHead
        title={`MH - امتحانات ${lessonTitle} | منصة مستر محمد حميدة`}
        description={`امتحانات ${lessonTitle} في منصة مستر محمد حميدة للمرحلة الإعدادية والثانوية`}
        keywords={`امتحانات, ${lessonTitle}, مستر محمد حميدة, منصة, رياضيات`}
        type="website"
      />
      {/* Your existing Exams component content */}
    </>
  );
};

export {
  HomeWithSEO,
  AdminWithSEO,
  UserWithSEO,
  AcademicYearsWithSEO,
  LessonsWithSEO,
  ExamsWithSEO,
};
