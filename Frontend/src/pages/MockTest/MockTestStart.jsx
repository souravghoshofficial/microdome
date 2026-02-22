import { useParams } from "react-router";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTestStart = () => {
  const { testId } = useParams();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={`w-full h-screen bg-white dark:bg-gray-950 text-black dark:text-white ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="max-w-5xl mx-auto py-10 px-4">

        <h1 className="text-2xl font-bold mb-6">Mock Test</h1>

        <div className="border rounded-xl p-6 bg-gray-50 dark:bg-gray-900">
          <p>Question UI will render here</p>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
            Submit Test
          </button>
        </div>

      </div>
    </div>
  );
};

export default MockTestStart;