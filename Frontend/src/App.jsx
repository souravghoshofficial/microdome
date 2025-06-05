import React, { useEffect, useState } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";

import { useDispatch } from "react-redux";
import { login, logout } from "./features/auth/authSlice";

import Layout from "./Layout.jsx";
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
  EntranceBatchLive,
  EntranceBatchRecorded,
  BScHonsBatch,
  EditUserDetails,
  CourseViewPage
} from "./pages";
import {
  Navbar,
  AuthenticatedRoute,
  Instructor,
  AuthLayout,
} from "./components";
import axios from "axios";
const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      // .get(`${ApiUrl}/api/v1/users/current-user`, {
      //   withCredentials: true,
      // })

      .get(`${ApiUrl}/api/v1/users/current-user`, {
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
  });

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
            <Route path="entrance-batch-live" element={<EntranceBatchLive />} />
            <Route
              path="entrance-batch-recorded"
              element={<EntranceBatchRecorded />}
            />
            <Route path="bsc-hons-batch" element={<BScHonsBatch />} />
          </Route>
          <Route path="/resources" element={<Resources />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/profile" element={<AuthenticatedRoute />}>
            <Route path="" element={<ProfileDashboard />} />
            <Route path="edit" element={<EditUserDetails />} />
          </Route>
        </Route>
        <Route path="/signup" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <Signup />]} />
        </Route>
        <Route path="/login" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <Login />]} />
        </Route>
        <Route path="/forgot-password" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <ForgotPassword />]} />
        </Route>
        <Route path="/my-course" element={<CourseViewPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
