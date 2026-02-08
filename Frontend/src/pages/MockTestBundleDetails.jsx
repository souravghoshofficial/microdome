import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Clock, Target, Lock, Check } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTestBundleDetails = () => {
  const { bundleId } = useParams();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await axios.get(
          `${ApiUrl}/user/mock-test-bundles/${bundleId}`
        );
        setBundle(res.data.data);
      } catch (err) {
        console.error("Failed to load bundle", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [bundleId]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Bundle not found
      </div>
    );
  }

  const discount =
    bundle.actualPrice > bundle.discountedPrice
      ? Math.floor(
          ((bundle.actualPrice - bundle.discountedPrice) /
            bundle.actualPrice) *
            100
        )
      : 0;

  return (
    <>
      <Helmet>
        <title>{bundle.title} | Mock Test Series</title>
      </Helmet>

      <div className="w-full flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white">
        <div className="my-32 w-[90%] max-w-6xl">

          {/* ================= HERO CARD ================= */}
          <div className="relative rounded-2xl border bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-zinc-900 shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-4 md:p-8">

              {/* IMAGE */}
              <div className="rounded-xl overflow-hidden border bg-white dark:bg-zinc-900">
                <img
                  src={bundle.thumbnail}
                  alt={bundle.title}
                  className="aspect-video object-cover w-full"
                />
              </div>

              {/* INFO */}
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold leading-tight">
                    {bundle.title}
                  </h1>

                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {bundle.description}
                  </p>

                  {/* PRICE */}
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{bundle.discountedPrice}
                    </span>

                    {bundle.actualPrice !== bundle.discountedPrice && (
                      <span className="line-through text-gray-500 text-lg">
                        ₹{bundle.actualPrice}
                      </span>
                    )}

                    {discount > 0 && (
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700 dark:bg-gray-200 dark:text-gray-800">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 inline-block" />
                    <span>{bundle.mockTestIds.length} full-length mock tests</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 inline-block" />
                    <span>Performance analysis and leaderboards</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="mt-6 w-full md:w-fit px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* ================= MOCK TEST LIST ================= */}
          <div className="mt-24">
            <h2 className="text-2xl font-semibold">
              What’s Included
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              You’ll get access to the following published mock tests after purchase.
            </p>

            <div className="mt-8 space-y-4">
              {bundle.mockTestIds.length === 0 ? (
                <p className="text-gray-500">
                  No published mock tests available yet.
                </p>
              ) : (
                bundle.mockTestIds.map((test, index) => (
                  <div
                    key={test._id}
                    className="flex items-center justify-between gap-4 p-5 rounded-xl border bg-white dark:bg-zinc-900 hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-semibold text-base">
                        {index + 1}. {test.title}
                      </p>

                      <div className="mt-2 flex items-center gap-5 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.durationMinutes} mins
                        </span>

                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {test.totalMarks} marks
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MockTestBundleDetails;
