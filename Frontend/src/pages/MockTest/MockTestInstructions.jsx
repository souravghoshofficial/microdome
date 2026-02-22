import { useParams, Link } from "react-router";
import { PlayCircle } from "lucide-react";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTestInstructions = () => {
  const { testId } = useParams();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={`w-full min-h-screen flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="my-24 md:my-32 w-[90%] max-w-4xl">

        <h1 className="text-3xl font-bold">Mock Test</h1>

        <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
          <p>• Read all questions carefully</p>
          <p>• Do not refresh during test</p>
          <p>• Timer cannot be paused</p>
        </div>

        <Link
          to={`/mock-tests/${testId}/start`}
          className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          <PlayCircle className="w-5 h-5" />
          Start Test
        </Link>

      </div>
    </div>
  );
};

export default MockTestInstructions;