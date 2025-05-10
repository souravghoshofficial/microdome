import React , {useState} from "react";
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
  EntranceBatchLive,
  EntranceBatchRecorded,
  BScHonsBatch
} from "./pages";
import { Navbar, AuthenticatedRoute , Instructor, AuthLayout } from "./components";

const App = () => {

  const [loader, setLoader] = useState(false)
 
  if(loader) return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;

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
            <Route path="entrance-batch-live" element = {<EntranceBatchLive />} />
            <Route path="entrance-batch-recorded" element = {<EntranceBatchRecorded />} />
            <Route path="bsc-hons-batch" element = {<BScHonsBatch />} />
          </Route>
          <Route path="/resources" element={<Resources />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faculties" element={<Faculties />}/>
            <Route path="/profile" element={<AuthenticatedRoute />}>
                <Route path="" element={<ProfileDashboard />} />
            </Route>
        </Route>
        <Route path="/signup" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <Signup />]} />
        </Route>
        <Route path="/login" element={<AuthLayout />}>
          <Route path="" element={[<Navbar />, <Login />]} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
