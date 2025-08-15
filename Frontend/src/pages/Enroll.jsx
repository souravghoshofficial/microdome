import { Link } from "react-router";
import { Rocket, BookOpen, Video } from "lucide-react";

const Enroll = () => {
  return (
    <div className="my-16 w-full flex items-center justify-center">
      <div className="w-[90%]">
        <h4 className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500">Enroll</h4>
        <h2 className="mt-2 text-3xl md:text-4xl text-center font-bold">
          Join Our Learning <span className="text-highlighted">Journey</span>
        </h2>
        <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
          Follow these simple steps to start your learning.
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-6">
          {/* CARD 1 */}
          <div className="flex-1 p-6 border border-gray-950/[.1] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 md:h-14 md:w-14 flex items-center justify-center bg-blue-100 dark:bg-[#0F1D2B] rounded-full border border-[#109FE7]">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-[#109FE7]" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Get Started Now</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Register on our platform to access a wealth of resources and courses tailored for you.
              </p>
            </div>
            <div className="mt-4 flex gap-3">
              <Link to="signup" className="px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Signup
              </Link>
              <Link to="courses" className="px-4 py-2 rounded-md text-sm border border-highlighted bg-highlighted hover:bg-highlighted-hover hover:border-highlighted-hover text-white">
                Enroll
              </Link>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="flex-1 p-6 border border-gray-950/[.1] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 md:h-14 md:w-14 flex items-center justify-center bg-green-100 dark:bg-[#0F1D2B] rounded-full border border-[#23C45C]">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#23C45C]" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Access Courses and Materials</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Start learning with our expert-led courses today!
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="flex-1 p-6 border border-gray-950/[.1] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] rounded-2xl shadow-sm  flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 md:h-14 md:w-14 flex items-center justify-center bg-red-100 dark:bg-[#0F1D2B] rounded-full border border-[#EF476F]">
                <Video className="w-5 h-5 md:w-6 md:h-6 text-[#EF476F]" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Join Live Classes Anytime</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Engage with instructors and peers in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
