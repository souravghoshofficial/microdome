import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // track loading state
  const [error, setError] = useState(null); // optional: track error

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/users/current-user`, {
          withCredentials: true,
        });
        dispatch(login(res.data.data));
      } catch (err) {
        console.error(err.message);
        setError(err.message);
        dispatch(logout());
      } finally {
        setLoading(false); // done loading regardless of success/fail
      }
    };

    fetchUser();
  }, [dispatch]);

  return { loading, error };
};
