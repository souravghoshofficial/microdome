import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  Circle,
  Clock,
  Award,
  Hash,
  Lock,
  AlertCircle,
  X,
  Star,
  Loader2,
} from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= STATE STYLE ================= */

function getStateClasses(state) {
  if (state === "CORRECT")
    return "border-green-500 bg-green-50 dark:bg-green-500/10";
  if (state === "INCORRECT")
    return "border-red-500 bg-red-50 dark:bg-red-500/10";
  return "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900";
}

function StateIcon({ state }) {
  if (state === "CORRECT")
    return (
      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
    );
  if (state === "INCORRECT")
    return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
  return <Circle className="w-5 h-5 text-gray-400" />;
}

/* ================= HEADER ================= */

function TestHeader({ mockTest, attemptNumber }) {
  return (
    <div className="mb-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {mockTest.title}
          </h1>

          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {mockTest.durationMinutes} min
            </div>

            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {mockTest.totalMarks} marks
            </div>

            <div className="flex items-center gap-1">
              <Hash className="w-4 h-4" />
              {mockTest.mockTestType}
            </div>
          </div>
        </div>

        {attemptNumber && (
          <div className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
            Attempt {attemptNumber}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STAT ================= */

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border p-5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
    </div>
  );
}

/* ================= LEGEND ================= */

function ResultLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-green-500 inline-block" />
        <span className="text-gray-700 dark:text-gray-300">
          Your answer = Correct
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-red-500 inline-block" />
        <span className="text-gray-700 dark:text-gray-300">
          Your answer = Wrong
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
        <span className="text-gray-700 dark:text-gray-300">Correct answer</span>
      </div>
    </div>
  );
}

/* ================= OPTION STYLE ================= */

function getOptionStyle(isCorrect, isSelected) {
  if (isSelected && isCorrect)
    return "border-green-500 bg-green-50 dark:bg-green-500/10";

  if (isSelected && !isCorrect)
    return "border-red-500 bg-red-50 dark:bg-red-500/10";

  if (!isSelected && isCorrect)
    return "border-blue-500 bg-blue-50 dark:bg-blue-500/10";

  return "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900";
}

/* ================= SECTION TABS ================= */

function SectionTabs({ sections, active, setActive }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
      {sections.map((s, i) => (
        <button
          key={s.sectionId}
          onClick={() => setActive(i)}
          className={`px-4 py-2 cursor-pointer flex flex-col items-center rounded-lg border text-sm font-medium transition whitespace-nowrap
            ${
              i === active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
        >
          {s.sectionTitle}
          <span className="opacity-70">({s.questionType})</span>
        </button>
      ))}
    </div>
  );
}

/* ================= QUESTION ================= */

function QuestionResult({ q }) {
  const user = q.userAnswer;

  return (
    <div
      className={`rounded-xl border p-5 mb-4 ${getStateClasses(q.resultState)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          Question {q.questionOrder}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <StateIcon state={q.resultState} />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {q.resultState}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            ({q.marksAwarded}/{q.marks})
          </span>
        </div>
      </div>

      <div className="mb-4 text-gray-900 dark:text-gray-100">
        {q.questionText}
      </div>

      {q.questionImageUrl && (
        <img
          src={q.questionImageUrl}
          alt=""
          className="mb-4 max-h-64 object-contain rounded"
        />
      )}

      {/* MCQ / MSQ */}
      {q.questionType !== "NAT" && (
        <div className="grid gap-2">
          {q.options.map((op) => {
            const isCorrect = q.correctAnswer.includes(op.label);
            const isSelected = user?.selectedOptions?.includes(op.label);
            const style = getOptionStyle(isCorrect, isSelected);

            return (
              <div
                key={op.label}
                className={`border rounded-lg p-3 text-sm text-gray-900 dark:text-gray-100 ${style}`}
              >
                <b>{op.label}.</b> {op.text}
              </div>
            );
          })}
        </div>
      )}

      {/* NAT */}
      {q.questionType === "NAT" && (
        <div className="text-sm space-y-1 text-gray-900 dark:text-gray-100">
          <div>
            Your answer: <b>{user?.numericAnswer ?? "—"}</b>
          </div>

          <div>
            Correct answer: <b>{q.numericAnswer}</b>
            {q.tolerance > 0 && (
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                (±{q.tolerance})
              </span>
            )}
          </div>

          {q.tolerance > 0 && (
            <div className="text-gray-500 dark:text-gray-400">
              Accepted range: {q.numericAnswer - q.tolerance} –{" "}
              {q.numericAnswer + q.tolerance}
            </div>
          )}
        </div>
      )}

      {q.answerExplanation && (
        <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <div className="flex">
            <div className="w-1.5 rounded-l-lg bg-blue-600" />
            <div className="px-4 py-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Answer Explanation
              </div>
              <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {q.answerExplanation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= NO ATTEMPT ================= */

function NoAttempt({ testId, navigate, theme }) {
  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
    >
      <div className="text-center max-w-sm">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          No Attempt Yet
        </h2>
        <button
          onClick={() => navigate(`/mock-tests/${testId}`)}
          className="mt-5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        >
          Start Test
        </button>
      </div>
    </div>
  );
}

/* ================= LOCKED BANNER ================= */

function LockedBanner() {
  return (
    <div className="mb-8 rounded-xl border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-500/10 p-5 flex items-start gap-3">
      <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="text-sm text-amber-800 dark:text-amber-200">
        Detailed solutions are locked until you complete all allowed attempts.
      </div>
    </div>
  );
}

/* ================= Feedback Banner ================= */

function FeedbackModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  theme = "light",
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleSubmit = () => {
    if (!rating) return;
    onSubmit({ rating, review });
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-[92%] max-w-md rounded-2xl shadow-xl p-6 relative
        ${
          theme === "dark"
            ? "bg-zinc-900 text-white border border-zinc-700"
            : "bg-white text-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-center">
          Rate this Mock Test
        </h2>

        <p className="text-sm text-center mt-1 text-gray-500 dark:text-gray-400">
          Your feedback helps us improve quality
        </p>

        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110 cursor-pointer"
            >
              <Star
                className={`w-8 h-8 ${
                  (hover || rating) >= s
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tell us what you liked or what can be improved..."
          className={`mt-5 w-full h-24 resize-none rounded-lg border p-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${
            theme === "dark"
              ? "bg-zinc-800 border-zinc-700 placeholder-zinc-400"
              : "bg-gray-50 border-gray-200"
          }`}
        />

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer
            ${
              theme === "dark"
                ? "bg-zinc-800 hover:bg-zinc-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Skip
          </button>

          <button
            disabled={!rating || loading}
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg text-sm font-semibold
                       bg-blue-600 hover:bg-blue-700 text-white
                       disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function MockTestResult() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const theme = useSelector((s) => s.theme.theme);

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    fetchResult();
  }, [attempt]);

  useEffect(() => {
    checkFeedbackPrompt(testId);

    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, [testId]);

  const fetchResult = async () => {
    try {
      const url = attempt
        ? `${ApiUrl}/user/mock-tests/${testId}/result?attempt=${attempt}`
        : `${ApiUrl}/user/mock-tests/${testId}/result`;

      const res = await axios.get(url, { withCredentials: true });

      setData(res.data);
      checkFeedbackPrompt(testId);
      setActiveSection(0);

      if (res.data.locked) setStatus("locked");
      else setStatus("full");
    } catch (e) {
      setStatus("noattempt");
    }
  };

  const markFeedbackPrompted = async (mockTestId) => {
    try {
      await axios.post(
        `${ApiUrl}/mock-tests/${mockTestId}/feedback/prompted`,
        {},
        { withCredentials: true },
      );
    } catch (e) {
      console.error("mark prompted failed");
    }
  };

  // Check feedback prompt
  const checkFeedbackPrompt = async (mockTestId) => {
    try {
      const res = await axios.get(
        `${ApiUrl}/mock-tests/${mockTestId}/feedback/check`,
        { withCredentials: true },
      );

      if (res.data.showFeedback) {
        // clear existing timer
        if (feedbackTimerRef.current) {
          clearTimeout(feedbackTimerRef.current);
        }

        feedbackTimerRef.current = setTimeout(() => {
          setShowFeedbackModal(true);
          markFeedbackPrompted(mockTestId);
        }, 10000);
      }
    } catch (e) {
      console.error("feedback check failed");
    }
  };

  // Submit feedback
  const submitFeedback = async ({ rating, review }) => {
    try {
      setFeedbackLoading(true);

      await axios.post(
        `${ApiUrl}/mock-tests/${testId}/feedback`,
        { rating, review },
        { withCredentials: true },
      );

      setShowFeedbackModal(false);

      toast.success("Thanks for your feedback 🙌");
    } catch (e) {
      toast.error("Failed to submit feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div
        className={`${theme === "dark" ? "dark" : ""} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
      >
        <div className="text-gray-600 dark:text-gray-400">
          Loading result...
        </div>
      </div>
    );
  }

  if (status === "noattempt") {
    return <NoAttempt testId={testId} navigate={navigate} theme={theme} />;
  }

  const { mockTest, result } = data;

  if (status === "locked") {
    return (
      <div
        className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-950`}
      >
        <div className="max-w-6xl mx-auto px-4 py-10">
          <TestHeader
            mockTest={mockTest}
            attemptNumber={data.attempt?.attemptNumber}
          />
          <LockedBanner />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Score" value={result.score} />
            <StatCard label="Correct" value={result.correctCount} />
            <StatCard label="Incorrect" value={result.incorrectCount} />
            <StatCard label="Unattempted" value={result.unattemptedCount} />
          </div>
        </div>
      </div>
    );
  }

  /* FULL */
  const { sections, attempts, selectedAttemptNumber } = data;
  const section = sections[activeSection];

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-950`}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        <Toaster
          position="top-center"
          gutter={8}
          containerStyle={{ top: 20 }}
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "13px",
              borderRadius: "10px",
              padding: "8px 12px",
              background: theme === "dark" ? "#18181b" : "#ffffff",
              color: theme === "dark" ? "#e4e4e7" : "#111827",
              border:
                theme === "dark" ? "1px solid #27272a" : "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
            success: {
              iconTheme: {
                primary: "#16a34a",
                secondary: "#ecfdf5",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fef2f2",
              },
            },
          }}
        />

        <TestHeader mockTest={mockTest} attemptNumber={selectedAttemptNumber} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Score" value={result.score} />
          <StatCard label="Correct" value={result.correctCount} />
          <StatCard label="Incorrect" value={result.incorrectCount} />
          <StatCard label="Unattempted" value={result.unattemptedCount} />
        </div>

        {attempts?.length > 1 && (
          <div className="mb-6">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Attempt
            </label>

            <select
              value={selectedAttemptNumber}
              onChange={(e) => setAttempt(e.target.value)}
              className="mt-1 block border rounded-lg px-3 py-2
                         bg-white dark:bg-gray-900
                         text-gray-900 dark:text-gray-100
                         border-gray-300 dark:border-gray-700"
            >
              {attempts.map((a) => (
                <option key={a.attemptNumber} value={a.attemptNumber}>
                  Attempt {a.attemptNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        <SectionTabs
          sections={sections}
          active={activeSection}
          setActive={setActiveSection}
        />

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-4">
            <div>
              Section Score:{" "}
              <span className="font-semibold">
                {section.score} / {section.maxScore}
              </span>
            </div>

            {section.questionsToAttempt !== null && (
              <div>
                Attempted:{" "}
                <span className="font-semibold">
                  {
                    section.questions.filter(
                      (q) => q.resultState !== "UNATTEMPTED",
                    ).length
                  }{" "}
                  / {section.questionsToAttempt}
                </span>
              </div>
            )}
          </div>

          <ResultLegend />
        </div>

        {section.questions.map((q) => (
          <QuestionResult key={q._id} q={q} />
        ))}

        <FeedbackModal
          theme={theme}
          open={showFeedbackModal}
          loading={feedbackLoading}
          onSubmit={submitFeedback}
          onClose={() => setShowFeedbackModal(false)}
        />
      </div>
    </div>
  );
}
