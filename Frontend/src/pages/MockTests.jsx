import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

import { Clock, Target, PlayCircle, ClipboardList, Loader2 } from "lucide-react";
import { Link } from "react-router";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTests = () => {
  const [freeMockTests, setFreeMockTests] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });

    const fetchData = async () => {
      try {
        const [mockTestsRes, bundlesRes] = await Promise.all([
          axios.get(`${ApiUrl}/user/mock-tests`),
          axios.get(`${ApiUrl}/user/mock-test-bundles`),
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
    <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-black dark:text-white">
      <div className="flex items-center gap-3 text-sm font-medium">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading...</span>
      </div>
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
        <div className="my-24 md:my-32 w-[90%] max-w-6xl">
          {/* PAGE HEADING */}
          <h1
            data-aos="fade-up"
            className="text-3xl md:text-4xl font-bold text-center"
          >
            Mock <span className="text-highlighted">Tests</span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-3 text-center text-gray-600 dark:text-gray-400"
          >
            Practice smart with free tests or go all-in with premium test series
          </p>

          {/* ================= NO TESTS AVAILABLE ================= */}
          {freeMockTests.length === 0 && bundles.length === 0 && (
            <div className="mt-8 min-h-[80vh] text-center">
              <p data-aos="fade-up" data-aos-delay="200" className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                No mock tests available at the moment.
              </p>
            </div>
          )}

          {/* ================= TEST SERIES ================= */}
          {bundles.length > 0 && (
            <section data-aos="fade-up" className="mt-16">
              <h2
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-xl md:text-2xl font-semibold"
              >
                Test Series
              </h2>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="mt-1 text-sm text-gray-600 dark:text-gray-400"
              >
                Curated premium mock test bundles for serious aspirants
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12"
              >
                {bundles.map((bundle) => {
                  const discount =
                    bundle.actualPrice > bundle.discountedPrice
                      ? Math.floor(
                          ((bundle.actualPrice - bundle.discountedPrice) /
                            bundle.actualPrice) *
                            100,
                        )
                      : 0;

                  return (
                    <div
                      key={bundle._id}
                      className="group hover:-translate-y-3 flex flex-col overflow-hidden rounded-xl border border-zinc-900/10 dark:border-gray-700/25 bg-white dark:bg-zinc-900 shadow-lg hover:border-blue-500 transition-all duration-300"
                    >
                      {/* IMAGE */}
                      <div className="p-4">
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={bundle.thumbnail}
                            alt={bundle.title}
                            className="h-48 w-full aspect-video object-cover transition-transform duration-500 ease-out transform-gpu group-hover:scale-110"
                          />
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 pt-0 flex flex-col flex-1">
                        <h3 className="text-lg font-bold">{bundle.title}</h3>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {bundle.description}
                        </p>

                        {/* PRICE + META */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">
                              ₹{bundle.discountedPrice}
                            </span>

                            {bundle.actualPrice !== bundle.discountedPrice && (
                              <span className="text-sm line-through text-gray-500">
                                ₹{bundle.actualPrice}
                              </span>
                            )}
                          </div>

                          <div>
                            <span className="text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-gray-100 text-blue-700 dark:text-black  font-semibold">
                              {bundle.mockTestIds.length} TESTS
                            </span>
                            {discount > 0 && (
                              <span className="ml-2 text-xs px-2 py-1 rounded-md bg-green-100 dark:bg-gray-100 text-green-700 dark:text-black font-semibold">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        <Link to={`/mock-tests/bundles/${bundle._id}`} className="mt-4 w-full px-3 py-2 text-center text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                          View Series
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ================= FREE MOCK TESTS ================= */}
          {freeMockTests.length > 0 && (
             <section data-aos="fade-up" className="mt-20">
            <h2
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-xl md:text-2xl font-semibold"
            >
              Free Mock Tests
            </h2>

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-1 text-sm text-gray-600 dark:text-gray-400"
            >
              Try individual mock tests at zero cost
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {freeMockTests.map((test) => (
                <div
                  key={test._id}
                  className="group relative p-5 rounded-2xl border border-zinc-900/10 dark:border-gray-700/25 
             bg-white dark:bg-zinc-900 shadow 
             hover:border-blue-500 transition-all duration-300 
             hover:shadow-xl hover:-translate-y-3"
                >
                  {/* FREE BADGE */}
                  <span
                    className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full
                   bg-green-100 text-green-700 dark:bg-gray-100 dark:text-black"
                  >
                    FREE
                  </span>

                  {/* BIG ICON / VISUAL */}
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

                  {/* META INFO */}
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
                    className="mt-3 w-full flex items-center justify-center gap-2
               bg-blue-600 hover:bg-blue-700 
               text-white py-2 rounded-lg 
               font-semibold transition cursor-pointer"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Start Test
                  </Link>
                </div>
              ))}
            </div>
          </section>
          )}
        </div>
      </div>
    </>
  );
};

export default MockTests;
