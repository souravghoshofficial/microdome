import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./Layout.jsx";
import AboutUs from "./pages/AboutUs.jsx";

import {
  Signup,
  Login,
  Courses,
  IITJAM,
  Landing,
  About,
  Enroll,
  Testimonial,
  Contact,
  CourseLayout 
} from "./pages";
import Navbar from "./components/Navbar.jsx";

const App = () => {
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
              <Testimonial />,
              <Contact />,
            ]}
          />
      
          <Route path="courses" element={<CourseLayout />}>
          <Route path="" element={<Courses />} />
          <Route path="iit-jam" element={<IITJAM />} />
          {/* <Route path="aboutus" element={[<AboutUs />]} /> */}
          </Route>
        </Route>
        <Route path="signup" element={[<Navbar /> , <Signup />]} />
        <Route path="/login" element={[<Navbar /> , <Login />]} />
        <Route path="/aboutus" element={[<AboutUs />]} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
