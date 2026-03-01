import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  Trophy,
  Medal,
  Clock,
  ChevronDown,
  AlertCircle,
  Hash,
  Award,
} from "lucide-react";

import dummyImage from "../../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= TIME ================= */

function formatTime(sec) {
  if (sec == null) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

/* ================= PODIUM ================= */

function Podium({ top3 }) {
  if (!top3.length) return null;

  const [first, second, third] = top3;

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-8 mt-8 sm:mt-10 mb-10 sm:mb-14 overflow-x-auto">
      {second && (
        <PodiumCard
          user={second}
          rank={2}
          height="h-24 sm:h-28"
          color="bg-gray-200 dark:bg-gray-700"
          icon={<Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-100" />}
        />
      )}

      {first && (
        <PodiumCard
          user={first}
          rank={1}
          height="h-28 sm:h-36"
          color="bg-yellow-300 dark:bg-yellow-500"
          icon={
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-900 dark:text-yellow-100" />
          }
          highlight
        />
      )}

      {third && (
        <PodiumCard
          user={third}
          rank={3}
          height="h-20 sm:h-24"
          color="bg-amber-600/80"
          icon={<Medal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
        />
      )}
    </div>
  );
}

function PodiumCard({ user, rank, height, color, icon, highlight }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center w-20 sm:w-24 md:w-32 shrink-0">
      <img
        src={user.photo || dummyImage}
        alt={user.name}
        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-4 ${
          highlight
            ? "border-yellow-400"
            : "border-gray-200 dark:border-gray-700"
        }`}
      />

      <div className="mt-2 text-center px-1">
        <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {user.name}
        </div>

        <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
          Attempt {user.bestAttempt.attemptNumber} | Score:{" "}
          {user.bestAttempt.score} | Time:{" "}
          {formatTime(user.bestAttempt.timeTakenSeconds)}
        </div>
      </div>

      {user.attempts.length > 1 && (
        <button
          onClick={() => setOpen(!open)}
          className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 cursor-pointer"
        >
          Attempts
          <ChevronDown
            className={`w-3 h-3 transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      <div
        className={`mt-2 w-full rounded-t-xl flex items-center justify-center ${height} ${color}`}
      >
        <div className="flex flex-col items-center text-xs sm:text-sm font-bold">
          {icon}
          <span className="text-gray-900 dark:text-gray-100">#{rank}</span>
        </div>
      </div>

      {open && (
        <div className="mt-2 w-full space-y-1">
          {user.attempts.map((a) => (
            <div
              key={a.attemptNumber}
              className="text-[10px] sm:text-[11px] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-center"
            >
              Attempt {a.attemptNumber} | Score: {a.score} | Time:{" "}
              {formatTime(a.timeTakenSeconds)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= ROW ================= */

function LeaderRow({ u }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-t border-gray-200 dark:border-gray-800">
        <td className="p-3 font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
          {u.rank}
        </td>

        <td className="p-3">
          <div className="flex items-center gap-3">
            <img
              src={u.photo || dummyImage}
              alt={u.name}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
            />
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-none">
              {u.name}
            </div>
          </div>
        </td>

        <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
          Attempt {u.bestAttempt.attemptNumber} | Score: {u.bestAttempt.score}
        </td>

        <td className="p-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(u.bestAttempt.timeTakenSeconds)}
          </div>
        </td>

        <td className="p-3 text-right">
          {u.attempts.length > 1 && (
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              Attempts
              <ChevronDown
                className={`w-4 h-4 transition ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </td>
      </tr>

      {open && (
        <tr className="bg-gray-50 dark:bg-gray-900/40">
          <td colSpan="5" className="px-4 sm:px-6 py-3">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {u.attempts.map((a) => (
                <div
                  key={a.attemptNumber}
                  className="px-2 sm:px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[10px] sm:text-xs text-gray-800 dark:text-gray-200"
                >
                  Attempt {a.attemptNumber} | Score: {a.score} | Time:{" "}
                  {formatTime(a.timeTakenSeconds)}
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ================= ERROR ================= */

function Blocked({ msg, navigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Leaderboard Locked
        </h2>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {msg}
        </p>

        <button
          onClick={() => navigate("/mock-tests")}
          className="mt-6 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Back to Tests
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function MockTestLeaderboard() {
  const { testId } = useParams();
  const theme = useSelector((s) => s.theme.theme);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      const res = await axios.get(
        `${ApiUrl}/user/mock-tests/${testId}/leaderboard`,
        { withCredentials: true }
      );
      setData(res.data);
    } catch (e) {
      if (e.response?.status === 403) {
        setError(e.response.data.message);
      } else {
        setError("Failed to load leaderboard");
      }
    }
  };

  if (error) {
    return <Blocked msg={error} navigate={navigate} />;
  }

  if (!data) {
    return (
      <div
        className={`${theme === "dark" ? "dark" : ""} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
      >
        <div className="text-gray-600 dark:text-gray-400">
          Loading leaderboard…
        </div>
      </div>
    );
  }

  const top3 = data.leaderboard.slice(0, 3);
  const rest = data.leaderboard.slice(3);
  const meta = data.mockTest;

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-white dark:bg-gray-950`}
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
            {meta?.title || "Leaderboard"}
          </h1>

          {meta && (
            <div className="mt-3 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                {meta.mockTestType}
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {meta.durationMinutes} min
              </div>

              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                {meta.totalMarks} marks
              </div>

              <div className="sm:ml-auto">
                {data.totalParticipants} participants
              </div>
            </div>
          )}
        </div>

        <Podium top3={top3} />

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto">
          <table className="min-w-[600px] w-full text-xs sm:text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  Rank
                </th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  User
                </th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  Best Attempt
                </th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  Time
                </th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {rest.map((u) => (
                <LeaderRow key={u.userId} u={u} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}