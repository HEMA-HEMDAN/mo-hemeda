import { Routes, Route, BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/rusable/ScrollToTop.jsx";
import Navbar from "./components/rusable/navComponents/Navbar.jsx";
import Footer from "./components/rusable/Footer.jsx";
import WhatsAppButton from "./components/rusable/WhatsAppButton.jsx";
// SEO Components
import CanonicalLink from "./components/rusable/CanonicalLink.jsx";
import SEOHead from "./components/rusable/SEOHead.jsx";
import StructuredData from "./components/rusable/StructuredData.jsx";
import RobotsMeta from "./components/rusable/RobotsMeta.jsx";
import { useSEO } from "./hooks/useSEO.js";
// Lazy Loading Components
import LazyWrapper, {
  LazyHome,
  LazyAuth,
  LazyAdmin,
  LazyUser,
  LazyAdminUsers,
  LazyAcademicYears,
  LazyLessons,
  LazyExams,
  LazyAdminResults,
  LazyUserAcademicYears,
  LazyUserLessons,
  LazyUserExam,
  LazyResult,
  LazyNotFound,
} from "./components/rusable/LazyWrapper.jsx";
// ==================== Read this =========================//

// we can save the whole response and we can make opration on it and take the token , role and data about
// user to make a dashboard and we need to make diagrams insted of the tables we should searsh for a library
// that's all after handling the logic and we should also change our host
// we can save data iside the local storage as cookies
// for the component file strucure we should make each sectoin component inside it's own folder to make the data more orgnized
// we are gonna restructure the website map first bafore all that to make the best use for code
// ===================== the new instructions =====================//
// first you will go to the user page it should desplay all exams result for the user you need to match the response with the
// exam data
// then you should make some edit's with the users sections you should read them very carefully
// there some instractions at the start of some pages just don't fuck my logic
// and i wish you good luck ya zemely :)
// SEO Wrapper Components with Lazy Loading
const HomeWithSEO = () => {
  const seoData = useSEO("home");
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      <LazyWrapper>
        <LazyHome />
      </LazyWrapper>
    </>
  );
};

const AuthWithSEO = () => {
  const seoData = useSEO("auth");
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyAuth />
      </LazyWrapper>
    </>
  );
};

const AdminWithSEO = () => {
  const seoData = useSEO("admin");
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyAdmin />
      </LazyWrapper>
    </>
  );
};

const AdminUsersWithSEO = () => {
  const seoData = useSEO("admin", {
    title: "MH - إدارة المستخدمين | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyAdminUsers />
      </LazyWrapper>
    </>
  );
};

const AcademicYearsWithSEO = () => {
  const seoData = useSEO("academicYears");
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyAcademicYears />
      </LazyWrapper>
    </>
  );
};

const LessonsWithSEO = () => {
  const seoData = useSEO("lessons", {
    title: "MH - إدارة الدروس | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyLessons />
      </LazyWrapper>
    </>
  );
};

const ExamsWithSEO = () => {
  const seoData = useSEO("exams", {
    title: "MH - إدارة الامتحانات | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyExams />
      </LazyWrapper>
    </>
  );
};

const AdminResultsWithSEO = () => {
  const seoData = useSEO("results", {
    title: "MH - نتائج الامتحانات | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyAdminResults />
      </LazyWrapper>
    </>
  );
};

const UserWithSEO = () => {
  const seoData = useSEO("user");
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyUser />
      </LazyWrapper>
    </>
  );
};

const UserAcademicYearsWithSEO = () => {
  const seoData = useSEO("academicYears", {
    title: "MH - السنوات الأكاديمية | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      <LazyWrapper>
        <LazyUserAcademicYears />
      </LazyWrapper>
    </>
  );
};

const UserLessonsWithSEO = () => {
  const seoData = useSEO("lessons", {
    title: "MH - الدروس | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      <LazyWrapper>
        <LazyUserLessons />
      </LazyWrapper>
    </>
  );
};

const UserExamWithSEO = () => {
  const seoData = useSEO("exams", {
    title: "MH - الامتحانات | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="index, follow" />
      <LazyWrapper>
        <LazyUserExam />
      </LazyWrapper>
    </>
  );
};

const ResultWithSEO = () => {
  const seoData = useSEO("results", {
    title: "MH - النتائج | منصة مستر محمد حميدة",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyResult />
      </LazyWrapper>
    </>
  );
};

const NotFoundWithSEO = () => {
  const seoData = useSEO("home", {
    title: "MH - الصفحة غير موجودة | منصة مستر محمد حميدة",
    robots: "noindex, nofollow",
  });
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData data={seoData.structuredData} />
      <RobotsMeta robots="noindex, nofollow" />
      <LazyWrapper>
        <LazyNotFound />
      </LazyWrapper>
    </>
  );
};

const App = () => {
  return (
    <>
      {/* Main App */}
      <BrowserRouter>
        <CanonicalLink />
        <ScrollToTop />
        <Navbar />
        <Routes>
          // =================== the home page =========================//
          <Route path="/" element={<HomeWithSEO />} />
          // =================== the auth page =========================//
          <Route path="/auth" element={<AuthWithSEO />} />
          // ============== what the fuck is the use of this==================//
          {/* <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} /> */}
          // =================== the admin page =========================//
          <Route path="/admin" element={<AdminWithSEO />} />
          <Route path="/admin/users" element={<AdminUsersWithSEO />} />
          <Route
            path="/admin/academic-years"
            element={<AcademicYearsWithSEO />}
          />
          <Route
            path="/admin/lessons/:academicYearId"
            element={<LessonsWithSEO />}
          />
          <Route path="/admin/exams/:lessonId" element={<ExamsWithSEO />} />
          <Route
            path="/admin/exams/results/:examId"
            element={<AdminResultsWithSEO />}
          />
          // =================== the user page =========================//
          <Route path="/user" element={<UserWithSEO />} />
          <Route
            path="/academic-years/:yearId"
            element={<UserAcademicYearsWithSEO />}
          />
          <Route path="/lessons/:lessonId" element={<UserLessonsWithSEO />} />
          <Route path="/exams/:examId" element={<UserExamWithSEO />} />
          <Route path="/exams/:examId/result" element={<ResultWithSEO />} />
          // =================== the not found page =========================//
          <Route path="*" element={<NotFoundWithSEO />} />
        </Routes>
        <WhatsAppButton />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
