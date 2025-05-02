import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./Layout.jsx";
import {
  Signup,
  Login,
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
} from "./pages";
import { Navbar, AuthenticatedRoute , Instructor } from "./components";

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
              <Instructor />,
              <Testimonial />,
              <Contact />,
            ]}
          />

          <Route path="courses" element={<CourseLayout />}>
            <Route path="" element={<Courses />} />
          </Route>
          <Route path="/resources" element={<Resources />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faculties" element={<Faculties />}/>
            <Route path="profile" element={<AuthenticatedRoute />}>
                <Route path="" element={<ProfileDashboard />} />
            </Route>
        </Route>
        <Route path="signup" element={[<Navbar />, <Signup />]} />
        <Route path="/login" element={[<Navbar />, <Login />]} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
