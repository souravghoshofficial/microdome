import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTests = () => {
  const [freeMockTests, setFreeMockTests] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });

    const fetchData = async () => {
      try {
        const [mockTestsRes, bundlesRes] = await Promise.all([
          axios.get(`${ApiUrl}/user/mock-tests`),
          axios.get(`${ApiUrl}/user/mock-test-bundles`)
        ]);

        setFreeMockTests(mockTestsRes.data.data || []);
        setBundles(bundlesRes.data.data || []);
      } catch (error) {
        console.error("Failed to load mock tests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mock Tests | Microdome Classes</title>
        <meta
          name="description"
          content="Attempt free mock tests or enroll in premium mock test series designed for competitive exams."
        />
      </Helmet>

      <div className="w-full flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white">
        <div className="my-24 md:my-32 w-[90%]">

          {/* ================= FREE MOCK TESTS ================= */}
          <h2
            className="text-3xl md:text-4xl font-bold text-center"
            data-aos="fade-up"
          >
            Free <span className="text-highlighted">Mock Tests</span>
          </h2>

          <p
            className="mt-3 text-center text-gray-600 dark:text-gray-400"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Practice with high-quality mock tests at zero cost
          </p>

          <div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {freeMockTests.map((test, index) => (
              <div
                key={test._id}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="bg-white dark:bg-gray-900 rounded-xl shadow p-5"
              >
                <h3 className="text-lg font-semibold">{test.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {test.description}
                </p>

                <div className="mt-4 text-sm">
                  <p>⏱ Duration: {test.durationMinutes} mins</p>
                  <p>🎯 Total Marks: {test.totalMarks}</p>
                  <p className="text-green-600 font-medium mt-1">FREE</p>
                </div>

                <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                  Start Test
                </button>
              </div>
            ))}
          </div>

          {/* ================= MOCK TEST SERIES ================= */}
          <h2
            className="text-3xl md:text-4xl font-bold text-center mt-24"
            data-aos="fade-up"
          >
            Mock Test <span className="text-highlighted">Series</span>
          </h2>

          <p
            className="mt-3 text-center text-gray-600 dark:text-gray-400"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Premium test series curated for serious aspirants
          </p>

          <div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {bundles.map((bundle, index) => (
              <div
                key={bundle._id}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="bg-white dark:bg-gray-900 rounded-xl shadow p-5"
              >
                <img
                  src={bundle.thumbnail}
                  alt={bundle.title}
                  className="h-40 w-full object-cover rounded"
                />

                <h3 className="text-lg font-semibold mt-4">
                  {bundle.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {bundle.description}
                </p>

                <div className="mt-4 text-sm">
                  <p>
                    <span className="line-through text-gray-400">
                      ₹{bundle.actualPrice}
                    </span>{" "}
                    <span className="text-green-600 font-semibold">
                      ₹{bundle.discountedPrice}
                    </span>
                  </p>
                  <p className="mt-1">
                    📦 Tests Included: {bundle.mockTestIds.length}
                  </p>
                </div>

                <button className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded">
                  View Series
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default MockTests;
