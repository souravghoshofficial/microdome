import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

import { Clock, Target, PlayCircle, ClipboardList, Loader2 } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MyBundleTests = () => {
  const theme = useSelector((state) => state.theme.theme);
  const { bundleId } = useParams();

  const [bundle, setBundle] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });

    const fetchBundleTests = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${ApiUrl}/user/mock-test-bundles/my-bundles/${bundleId}`,
          { withCredentials: true }
        );

        setBundle(res.data.bundle);
        setTests(res.data.mockTests || []);
      } catch (err) {
        console.error("Failed to load bundle tests", err);

        if (err.response?.status === 403) {
          setError("You are not enrolled in this bundle.");
        } else {
          setError("Failed to load bundle tests.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBundleTests();
  }, [bundleId]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-black dark:text-white">
        <div className="flex items-center gap-3 text-sm font-medium">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading tests...</span>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-black dark:text-white">
        <h1 className="text-xl font-semibold">{error}</h1>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!bundle) return null;

  return (
    <div className={`${theme} w-full min-h-screen flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white`}>
      <div className="my-24 md:my-32 w-[90%] max-w-6xl">

        {/* ================= BUNDLE HEADER ================= */}
        <div
          data-aos="fade-up"
        >
          {/* INFO */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              {bundle.title}
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
              {bundle.description}
            </p>

          </div>
        </div>

        {/* ================= TEST GRID ================= */}
        {tests.length > 0 ? (
          <section className="mt-16">
            <h2
              data-aos="fade-up"
              className="text-xl md:text-2xl font-semibold"
            >
              Available Tests
            </h2>

            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="group relative p-5 rounded-2xl border border-zinc-900/10 dark:border-gray-700/25 
                  bg-white dark:bg-zinc-900 shadow 
                  hover:border-blue-500 transition-all duration-300 
                  hover:shadow-xl hover:-translate-y-3"
                >
                  {/* ICON */}
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-xl 
                    bg-blue-100 text-blue-600 dark:bg-gray-800 mb-4
                    group-hover:scale-105 transition"
                  >
                    <ClipboardList className="w-7 h-7" />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-semibold leading-snug">
                    {test.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm my-1 text-gray-600 dark:text-gray-400 line-clamp-2">
                    {test.description}
                  </p>

                  {/* META */}
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{test.durationMinutes} mins</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span>{test.totalMarks} marks</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/mock-tests/${test._id}`}
                    className="mt-4 w-full flex items-center justify-center gap-2
                    bg-blue-600 hover:bg-blue-700 
                    text-white py-2 rounded-lg 
                    font-semibold transition"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Start Test
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
            No tests available in this bundle yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBundleTests;