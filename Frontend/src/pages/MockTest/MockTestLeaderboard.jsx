import { useParams } from "react-router";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTestLeaderboard = () => {
  const { testId } = useParams();
  const theme = useSelector((state) => state.theme.theme);
  
  return (
    <div className={`w-full min-h-screen flex justify-center bg-white dark:bg-gray-950 text-black dark:text-white ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="my-24 md:my-32 w-[90%] max-w-4xl">

        <h1 className="text-3xl font-bold">Leaderboard</h1>

        <div className="mt-8 border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Score</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-3">1</td>
                <td className="p-3">User A</td>
                <td className="p-3">95</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MockTestLeaderboard;