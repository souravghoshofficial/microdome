import { useParams } from "react-router";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTestResult = () => {
  const { testId } = useParams();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={`w-full min-h-screen flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="my-24 md:my-32 w-[90%] max-w-4xl">

        <h1 className="text-3xl font-bold">Your Result</h1>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-2xl font-bold">78</p>
          </div>

          <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Rank</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MockTestResult;