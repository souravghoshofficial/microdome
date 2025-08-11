import React, { useEffect, useState } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";

import { useDispatch } from "react-redux";
import { login, logout } from "./features/auth/authSlice";

import Layout from "./Layout.jsx";
import {
  Dashboard,
  AddLecture,
  AddSection,
  AllUsers,
  PremiumUsers,
  AllCourses,
  CreateQuiz
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
} from "./pages";
import {
  Navbar,
  AuthenticatedRoute,
  Instructor,
  AuthLayout,
  PaymentSuccess,
  AdminLayout,
} from "./components";
import axios from "axios";
const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    axios
      .get(`${ApiUrl}/users/current-user`, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(logout());
        dispatch(login(res.data.data));
      })
      .catch((err) => {
        console.log(err.message);
        dispatch(logout());
      });
  }, []);

  const [loader, setLoader] = useState(false);

  if (loader)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );

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

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="add-lecture" element={<AddLecture />} />
            <Route path="add-section" element={<AddSection />} />

            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-courses" element={<AllCourses />} />
            <Route path="premium-users" element={<PremiumUsers />} />
            <Route path="create-quiz" element={<CreateQuiz />} />
          </Route>
        </Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
