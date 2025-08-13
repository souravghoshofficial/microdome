import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCourses } from "../features/courses/courseSlice";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

export const useCourses = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/courses/get-all-courses`);
        dispatch(setCourses(res.data.courses));
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchCourses();
  }, [dispatch]);
};
