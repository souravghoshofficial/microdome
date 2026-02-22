import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideCard } from "./features/profileCard/profileCardSlice.js";

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
  Coupons,
  CreateCoupon,
  AllQuizzes,
  QuizResults,
  EditQuiz,
  ResetQuizPrice,
  AdminMockTests,
  AdminMockTestSections,
  AdminMockTestQuestions,
  AdminMockTestBundles,
  AdminManageMockTestBundle,
  MonthlyFeeSheet
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
  QuizResult,
  QuizLeaderboard,
  Exam,
  PageNotFound,
  MockTests,
  MockTestBundleDetails, 
  MyBundleTests,
  MockTestInstructions,
  MockTestStart,
  MockTestResult,
  MockTestLeaderboard
} from "./pages";

import {
  Navbar,
  AuthenticatedRoute,
  Instructor,
  AuthLayout,
  PaymentSuccess,
  AdminLayout,
  Footer
} from "./components";

import { useCourses } from "./hooks/courses.js";
import { useAuth } from "./hooks/auth.js";
import { useEnrolledTestBundles } from './hooks/getEnrolledMockTestBundles.js';

const App = () => {
  const isProfileCardHidden = useSelector((state) => state.profileCard.show)
  const dispatch = useDispatch();
  const { loading } = useAuth();
  useEnrolledTestBundles();
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

          {/* Mock Test Routes*/}
          <Route path="/mock-tests" element={<MockTests/>}/>
          <Route path="/mock-tests/bundles/:bundleId" element={<MockTestBundleDetails/>}/>
         

          <Route path="/resources" element={<Resources />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/exams" element={<Exam />} />
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
            <Route path="quizzes" element={<AllQuizzes />} />
            <Route path="create-quiz" element={<CreateQuiz />} />
            <Route path="edit-quiz/:quizId" element={<EditQuiz />} />
            <Route path="quiz-result/:quizId" element={<QuizResults />} />
            <Route path="reset-quiz-price" element={<ResetQuizPrice />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="coupons/create" element={<CreateCoupon />} />
            <Route path="mock-tests" element={<AdminMockTests />}/>
            <Route path="mock-tests/:mockTestId" element={<AdminMockTestSections />}/>
            <Route path="mock-tests/:mockTestId/:mockTestSectionId/questions" element={<AdminMockTestQuestions />}/>
            <Route path="mock-test-bundles" element={<AdminMockTestBundles />}/>
            <Route path="mock-test-bundles/:bundleId" element={<AdminManageMockTestBundle />}/>
            <Route path="monthly-fee-sheet/:courseId" element={<MonthlyFeeSheet/>}/>
            
          </Route>
        </Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/quizzes" element={[<QuizList />, <Navbar />]} />
        <Route path="/quiz/:quizId" element={<QuizLayout />} />
        <Route path="/quiz/result/:quizId" element={<QuizResult />} />
        <Route path="/quiz/leaderboard/:quizId" element={[<QuizLeaderboard /> , <Navbar />]} />
        <Route path="/checkout/:itemType/:id" element = {<CheckOut/>}/>
        <Route path="*" element={<PageNotFound />}/>


          {/* Mock Test Routes */}
         <Route path="/my-bundles/:bundleId" element={[<MyBundleTests />, <Navbar />]}/>
         <Route path="/mock-tests/:testId" element={<MockTestInstructions />}/>
         <Route path="/mock-tests/:testId/start" element={<MockTestStart />}/>
         <Route path="/mock-tests/:testId/result" element={<MockTestResult />}/>
         <Route path="/mock-tests/:testId/leaderboard" element={<MockTestLeaderboard />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
