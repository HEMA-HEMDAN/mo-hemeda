import { Suspense, lazy } from "react";

// Lazy loading wrapper for better performance
const LazyWrapper = ({ children, fallback = null }) => {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c5f10f]"></div>
              <p className="text-gray-300 text-lg font-medium">Loading...</p>
            </div>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
};

// Lazy load components for better performance
export const LazyHome = lazy(() => import("../../sections/Home.jsx"));
export const LazyAuth = lazy(() => import("../../sections/Auth.jsx"));
export const LazyAdmin = lazy(() =>
  import("../../sections/adminSections/Admin.jsx")
);
export const LazyUser = lazy(() =>
  import("../../sections/userSections/User.jsx")
);
export const LazyAdminUsers = lazy(() =>
  import("../../sections/adminSections/AdminUsers.jsx")
);
export const LazyAcademicYears = lazy(() =>
  import("../../sections/adminSections/AcademicYears.jsx")
);
export const LazyLessons = lazy(() =>
  import("../../sections/adminSections/Lessons.jsx")
);
export const LazyExams = lazy(() =>
  import("../../sections/adminSections/Exams.jsx")
);
export const LazyAdminResults = lazy(() =>
  import("../../sections/adminSections/AdminResults.jsx")
);
export const LazyUserAcademicYears = lazy(() =>
  import("../../sections/userSections/UserAcademicYears.jsx")
);
export const LazyUserLessons = lazy(() =>
  import("../../sections/userSections/UserLessons.jsx")
);
export const LazyUserExam = lazy(() =>
  import("../../sections/userSections/UserExam.jsx")
);
export const LazyResult = lazy(() =>
  import("../../sections/userSections/Result.jsx")
);
export const LazyNotFound = lazy(() => import("../../sections/NotFound.jsx"));

export default LazyWrapper;
