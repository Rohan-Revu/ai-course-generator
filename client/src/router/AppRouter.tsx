import { Routes, Route } from "react-router-dom";
import Index from "../components/pages/Index";
import NotFound from "../components/pages/NotFound";
import SignIn from "../components/pages/SignIn";
import SignUp from "../components/pages/SignUp";
import Dashboard from "../components/pages/Dashboard";
import CreateCourse from "../components/pages/CreateCourse";
import CourseDetail from "../components/pages/CourseDetail";
import ProtectedRoute from "../components/ProtectedRoute";
import ManageCourses from "../components/pages/ManageCourses";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/create-course"
      element={
        <ProtectedRoute>
          <CreateCourse />
        </ProtectedRoute>
      }
    />
    <Route
      path="/course/:id"
      element={
        <ProtectedRoute>
          <CourseDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/manage-courses"
      element={
        <ProtectedRoute>
          <ManageCourses />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
