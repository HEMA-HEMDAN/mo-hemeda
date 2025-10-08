import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./sections/Home.jsx";
import ScrollToTop from "./components/rusable/ScrollToTop.jsx";
import Navbar from "./components/rusable/navComponents/Navbar.jsx";
import Footer from "./components/rusable/Footer.jsx";
import WhatsAppButton from "./components/rusable/WhatsAppButton.jsx";
import NotFound from "./sections/NotFound.jsx";
import Auth from "./sections/Auth.jsx";
import Admin from "./sections/adminSections/Admin.jsx";
import User from "./sections/userSections/User.jsx";
import AdminUsers from "./sections/adminSections/AdminUsers.jsx";
import AcademicYears from "./sections/adminSections/AcademicYears.jsx";
import Lessons from "./sections/adminSections/Lessons.jsx";
import Exams from "./sections/adminSections/Exams.jsx";
import AdminResults from "./sections/adminSections/AdminResults.jsx";
import UserAcademicYears from "./sections/userSections/UserAcademicYears.jsx";
import UserLessons from "./sections/userSections/UserLessons.jsx";
import UserExam from "./sections/userSections/UserExam.jsx";
import Result from "./sections/userSections/Result.jsx";
// ==================== Read this =========================//

// we can save the whole response and we can make opration on it and take the token , role and data about
// user to make a dashboard and we need to make diagrams insted of the tables we should searsh for a library
// that's all after handling the logic and we should also change our host
// we can save data iside the local storage as cookies
// for the component file strucure we should make each sectoin component inside it's own folder to make the data more orgnized
// we are gonna restructure the website map first bafore all that to make the best use for code
const App = () => {
  return (
    <>
      {/* Main App */}
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          // =================== the home page =========================//
          <Route path="/" element={<Home />} />
          // =================== the auth page =========================//
          <Route path="/auth" element={<Auth />} />
          // ============== what the fuck is the use of this==================//
          {/* <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} /> */}
          // =================== the admin page =========================//
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/academic-years" element={<AcademicYears />} />
          <Route path="/admin/lessons/:academicYearId" element={<Lessons />} />
          <Route path="/admin/exams/:lessonId" element={<Exams />} />
          <Route
            path="/admin/exams/results/:examId"
            element={<AdminResults />}
          />
          // =================== the user page =========================//
          <Route path="/user" element={<User />} />
          <Route
            path="/academic-years/:yearId"
            element={<UserAcademicYears />}
          />
          <Route path="/lessons/:lessonId" element={<UserLessons />} />
          <Route path="/exams/:examId" element={<UserExam />} />
          <Route path="/exams/:examId/result" element={<Result />} />
          // =================== the not found page =========================//
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
