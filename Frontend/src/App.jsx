import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./Layout.jsx";

import {
  Dashboard,
  AddLecture,
  AddSection,
  AllUsers,
  PremiumUsers,
  AllCourses,
  CreateQuiz,
  CreateCourse,
  PremiumUserDetails,
} from "./components/Admin";

import {
  Signup,
  Login,
  ForgotPassword,
  Courses,
  Landing,
  About,
  Enroll,
  Testimonial,
  Contact,
  CourseLayout,
  AboutUs,
  ProfileDashboard,
  Resources,
  Faculties,
  EntranceBatch,
  BScHonsBatch,
  EditUserDetails,
  CourseViewPage,
  Admin,
  SemesterCourseLayout,
  QuizList,
  QuizLayout,
  LoadingScreen,
  Developers,
  LandingPageCourses,
  CheckOut,
} from "./pages";

import {
  Navbar,
  AuthenticatedRoute,
  Instructor,
  AuthLayout,
  PaymentSuccess,
  AdminLayout,
} from "./components";

import { useCourses } from "./hooks/courses.js";
import { useAuth } from "./hooks/auth.js";

const App = () => {
  const { loading } = useAuth();
  useCourses();

  if (loading) {
    return (
      <div className="w-full">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path=""
            element={[
              <Landing />,
              <About />,
              <Enroll />,
              <LandingPageCourses />,
              <Instructor />,
              <Testimonial />,
              <Contact />,
            ]}
          />

          <Route path="/courses" element={<CourseLayout />}>
            <Route path="" element={<Courses />} />
            <Route path="/courses/:id" element={<EntranceBatch />} />
            <Route path="bsc-hons-batch" element={<CourseLayout />}>
              <Route path="" element={<BScHonsBatch />} />
              <Route
                path="/courses/bsc-hons-batch/:id"
                element={<SemesterCourseLayout />}
              />
            </Route>
          </Route>

          <Route path="/resources" element={<Resources />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/developers" element={<Developers />} />
        </Route>
        <Route path="/signup" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <Signup />]} />
        </Route>
        <Route path="/profile" element={<AuthenticatedRoute />}>
          <Route path="" element={[<ProfileDashboard />, <Navbar />]} />
          <Route path="edit" element={[<EditUserDetails />, <Navbar />]} />
        </Route>
        <Route path="/login" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <Login />]} />
        </Route>
        <Route path="/forgot-password" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <ForgotPassword />]} />
        </Route>
        <Route path="/my-courses/:id" element={<CourseViewPage />} />

        {/* Admin Routes */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="add-lecture" element={<AddLecture />} />
            <Route path="add-section" element={<AddSection />} />

            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-courses" element={<AllCourses />} />
            <Route path="premium-users" element={<PremiumUsers />} />
            <Route path="premium-users/:id" element={<PremiumUserDetails />} />
            <Route path="create-quiz" element={<CreateQuiz />} />
            <Route path="create-course" element={<CreateCourse />} />
          </Route>
        </Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/quiz" element={[<QuizList />, <Navbar />]} />
        <Route path="/quiz/:quizId" element={<QuizLayout />} />
        <Route path="/checkout/:id" element = {<CheckOut/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
