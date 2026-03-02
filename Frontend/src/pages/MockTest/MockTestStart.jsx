import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  Clock,
  CheckCircle2,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  Lock,
  ShieldX,
  SearchX,
  ServerCrash,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import debounce from "lodash.debounce";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

/* ================= EXPIRED SCREEN ================= */

function ExpiredScreen({ onViewResult, theme }) {
  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
    >
      <div className=" w-[95vw] max-w-[420px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl px-8 py-7 shadow-xl text-center">
        {/* icon */}
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
          <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Time is up
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your mock test has been automatically submitted.
        </p>

        <button
          onClick={onViewResult}
          className="w-full cursor-pointer py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          View Result
        </button>
      </div>
    </div>
  );
}

// ================ ERROR SCREEN ================ //

function ErrorScreen({ error, errorCode, navigate, theme }) {
  const config = {
    400: {
      title: "Invalid Test",
      icon: AlertCircle,
    },
    401: {
      title: "Login Required",
      icon: Lock,
    },
    403: {
      title: "Access Denied",
      icon: ShieldX,
    },
    404: {
      title: "Test Not Found",
      icon: SearchX,
    },
    500: {
      title: "Server Error",
      icon: ServerCrash,
    },
  };

  const { title, icon: Icon } = config[errorCode] || config[500];

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
    >
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
          <Icon className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>

        {/* Action */}
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
            navigate("/mock-tests");
          }}
          className="mt-6 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
        >
          Back to Mock Tests
        </button>
      </div>
    </div>
  );
}

function SubmittingScreen({ auto }) {
  const theme = useSelector((s) => s.theme.theme);
  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm`}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl px-8 py-7 shadow-2xl border border-gray-200 dark:border-zinc-700 text-center">
        <div className="mx-auto mb-4 w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {auto ? "Time is up" : "Submitting Test"}
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {auto
            ? "Your test is being submitted automatically"
            : "Please wait while we submit your answers"}
        </p>
      </div>
    </div>
  );
}

function SubmitSuccessScreen({ attemptId, testId, navigate }) {
  const theme = useSelector((s) => s.theme.theme);
  const exitAndGo = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {}

    // allow browser to actually exit fullscreen
    setTimeout(() => {
      navigate(`/mock-tests/${testId}/result`, { replace: true });
    }, 120);
  };

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
    >
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl px-8 py-7 shadow-xl text-center w-[95vw] max-w-[420px]">
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Test Submitted Successfully
        </h3>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your responses have been recorded.
        </p>

        {/* Button */}
        <button
          onClick={exitAndGo}
          className="w-full cursor-pointer py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          View Result
        </button>
      </div>
    </div>
  );
}

/* ================= NEW: ANTI-CHEAT WARNING MODALS ================= */

// // ⭐ MODIFIED/ADDED: Fullscreen Escape Warning Modal
function FullscreenWarning({ theme, onClose }) {
  // 🔥 ADDED: Force fullscreen function
  const forceFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      onClose(); // close modal only after fullscreen is restored
    } catch (err) {
      console.error("Fullscreen request failed:", err);
      // If fullscreen fails, keep modal open
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`${theme === "dark" ? "dark" : ""} w-[95vw] max-w-[420px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl px-8 py-7 shadow-2xl text-center`}
      >
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Fullscreen Exit Attempted!
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          Leaving fullscreen during the exam is not allowed. Please stay in
          fullscreen mode to continue.
        </p>

        {/* 🔥 MODIFIED: onClick now forces fullscreen */}
        <button
          onClick={forceFullscreen}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
        >
          Return to Fullscreen
        </button>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <>
      <div className="text-gray-500 dark:text-gray-400">{label}</div>
      <div className={`font-semibold ${color}`}>{value}</div>
    </>
  );
}

function Button({ children, onClick, variant = "primary", className = "" }) {
  const base =
    "px-4 py-2.5 md:py-2 rounded-xl font-medium transition hover:translate-y-[-2px]";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost:
      "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
    purple: "bg-purple-600 text-white hover:bg-purple-700",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className} cursor-pointer text-nowrap`}
    >
      {children}
    </button>
  );
}

/* ================= TIMER ================= */

function useExamTimer(startedAt, durationSeconds) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!startedAt || !durationSeconds) return;

    const end = new Date(startedAt).getTime() + durationSeconds * 1000;

    const tick = () =>
      setRemaining(Math.max(0, Math.floor((end - Date.now()) / 1000)));

    tick(); // immediate sync
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [startedAt, durationSeconds]);

  return remaining;
}

/* ================= HEADER ================= */

function ExamHeader({
  title,
  remaining,
  stats,
  currentSection,
  sectionAnsweredCount,
}) {
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>

        <div className="flex items-center gap-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-xl font-mono">
          <Clock className="w-5 h-5" />
          {`${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`}
        </div>
      </div>

      {/* GATE legend box */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40">
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <LegendItem
            color="bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            text="Not Visited"
            count={stats.notVisited}
          />

          <LegendItem
            color="bg-orange-500 text-white"
            text="Not Answered"
            count={stats.notAnswered}
          />

          <LegendItem
            color="bg-green-600 text-white"
            text="Answered"
            count={stats.answered}
          />

          <LegendItem
            color="bg-purple-600 text-white"
            text="Marked for Review"
            count={stats.markedOnly}
            className="ml-1.5 sm:ml-0"
          />

          <LegendItem
            color="bg-purple-600 text-white"
            text="Answered & Marked for Review"
            subText="( will be considered for evaluation )"
            count={stats.answeredMarked}
            isAnsweredMarked={true}
          />

          {currentSection?.questionsToAttempt !== null && (
            <div className="ml-auto text-xs text-gray-600 dark:text-gray-400">
              Section limit:{" "}
              <span className="font-semibold">
                {sectionAnsweredCount}/{currentSection.questionsToAttempt}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  text,
  subText = "",
  count,
  isAnsweredMarked = false,
  className = "",
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold ${color} relative ${className}`}
      >
        {count}
        {isAnsweredMarked && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full" />
        )}
      </div>
      <div className="text-sm flex flex-col items-center">
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {text}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          {subText}
        </span>
      </div>
    </div>
  );
}

/* ================= SECTION TABS ================= */

function SectionTabs({ sections, active, setActive }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {sections.map((s, i) => (
        <button
          key={s.sectionId}
          onClick={() => setActive(i)}
          className={`px-5 py-1.5 rounded-xl whitespace-nowrap border transition flex flex-col items-center cursor-pointer ${
            i === active
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          }`}
        >
          {s.sectionTitle}
          <span className="text-xs">({s.questionType})</span>
        </button>
      ))}
    </div>
  );
}

/* ================= GATE PALETTE ================= */

function getGateColor(q, active) {
  const s = q.state || {};
  if (!s.isVisited)
    return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  if (s.isAnswered && s.isMarkedForReview) return "bg-purple-600 text-white";

  if (s.isMarkedForReview) return "bg-purple-600 text-white";

  if (s.isAnswered) return "bg-green-600 text-white";

  return "bg-orange-500 text-white";
}

function Palette({ questions, currentIndex, setIndex }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-6 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-2.5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 rounded-lg cursor-pointer"
      >
        <span className="font-medium">Question Navigation</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "-rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="flex flex-wrap gap-2 mt-4 p-1">
          {questions.map((q, i) => {
            const active = i === currentIndex;
            const color = getGateColor(q, active);

            return (
              <button
                key={q._id}
                onClick={() => setIndex(i)}
                className={`relative w-10 h-10 rounded-md font-medium flex items-center justify-center cursor-pointer ${color} ${
                  active ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {i + 1}

                {q.state?.isAnswered && q.state?.isMarkedForReview && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= QUESTION ================= */

function QuestionView({ q, answer, onAnswer }) {
  const toggle = (label) => {
    if (q.questionType === "MCQ") onAnswer([label], null);
    else {
      const arr = answer || [];
      if (arr.includes(label))
        onAnswer(
          arr.filter((x) => x !== label),
          null,
        );
      else onAnswer([...arr, label], null);
    }
  };

  return (
    <Card className="p-6 mb-6 select-none">
      <div className="mb-4 font-semibold flex items-center justify-between">
        Question {q.questionOrder}
        <span className="ml-3 text-sm font-normal text-gray-500">
          ({q.marks} {q.marks > 1 ? "marks" : "mark"})
        </span>
      </div>

      <div className="mb-4">{q.questionText}</div>

      {q.questionImageUrl && (
        <img
          src={q.questionImageUrl}
          alt=""
          className="mb-4 max-h-64 object-contain"
        />
      )}

      {q.questionType !== "NAT" && (
        <div className="grid gap-2">
          {q.options.map((op) => (
            <div
              key={op.label}
              onClick={() => toggle(op.label)}
              className={`border rounded-xl p-3 cursor-pointer ${
                answer?.includes(op.label)
                  ? "bg-blue-50 border-blue-500 dark:bg-blue-500/15 dark:border-blue-400"
                  : ""
              }`}
            >
              <b>{op.label}.</b> {op.text}
            </div>
          ))}
        </div>
      )}

      {q.questionType === "NAT" && (
        <input
          type="number"
          value={answer || ""}
          onChange={(e) => onAnswer(null, e.target.value)}
          className="border rounded-lg px-3 py-2 w-40"
        />
      )}
    </Card>
  );
}

/* ================= MAIN ================= */

export default function MockTestStart() {
  const { testId } = useParams();
  const theme = useSelector((s) => s.theme.theme);
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(null);
  const [mockTest, setMockTest] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitState, setSubmitState] = useState("IDLE");
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [showExpiredScreen, setShowExpiredScreen] = useState(false);
  const [expiredAttemptId, setExpiredAttemptId] = useState(null);
  const [examActive, setExamActive] = useState(true);

  // New state for fullscreen warning
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  const remaining = useExamTimer(startedAt, durationSeconds);

  const timerReady = durationSeconds > 0 && startedAt;

  const currentSection = sections[activeSection];
  const currentQuestions = currentSection?.questions || [];
  const currentQuestion = currentQuestions[qIndex];

  // Fullscreen guard
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && examActive) {
        // user tried to exit during exam
        setShowFullscreenWarning(true);

        // re-enter fullscreen safely
        setTimeout(() => {
          if (examActive) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }, 150);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [examActive]);

  const sectionAnsweredCount = useMemo(() => {
    if (!currentSection) return 0;
    return currentSection.questions.filter((q) => q.state?.isAnswered).length;
  }, [currentSection]);

  const stats = useMemo(() => {
    const all = sections.flatMap((s) => s.questions);

    let notVisited = 0;
    let notAnswered = 0;
    let answered = 0;
    let markedOnly = 0;
    let answeredMarked = 0;

    all.forEach((q) => {
      const st = q.state || {};

      if (!st.isVisited) {
        notVisited++;
        return;
      }

      if (st.isAnswered && st.isMarkedForReview) {
        answeredMarked++;
        return;
      }

      if (st.isMarkedForReview) {
        markedOnly++;
        return;
      }

      if (st.isAnswered) {
        answered++;
        return;
      }

      notAnswered++;
    });

    return {
      notVisited,
      notAnswered,
      answered,
      markedOnly,
      answeredMarked,
    };
  }, [sections]);

  const sectionStats = useMemo(() => {
    return sections.map((sec) => {
      const answered = sec.questions.filter((q) => q.state?.isAnswered).length;

      return {
        title: sec.sectionTitle,
        answered,
        limit: sec.questionsToAttempt,
      };
    });
  }, [sections]);

  const handleViewExpiredResult = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {}

    setTimeout(() => {
      navigate(`/mock-tests/${testId}/result`, { replace: true });
    }, 120);
  };

  /* ===== INIT ===== */

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      const startRes = await axios.post(
        `${ApiUrl}/user/mock-tests/${testId}/start`,
        {},
        { withCredentials: true },
      );

      const data = startRes.data;

      // ===== CASE 1: expired attempt =====
      if (data.expired) {
        setExpiredAttemptId(data.attemptId);
        setShowExpiredScreen(true);
        return;
      }

      setAttemptId(data.attemptId);
      setStartedAt(data.startedAt);
      setDurationSeconds(data.durationSeconds);
      setMockTest(data.mockTest);

      const sessionRes = await axios.get(
        `${ApiUrl}/user/mock-tests/attempt/${data.attemptId}`,
        { withCredentials: true },
      );

      setSections(sessionRes.data.sections);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setErrorCode(err.response.status);
        setError(err.response.data?.message || "Something went wrong.");
      } else {
        setErrorCode(500);
        setError("Server not responding. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===== TIMER EFFECT ===== */
  useEffect(() => {
    if (!attemptId || !timerReady) return;

    if (remaining === 300) {
      toast("Only 5 minutes remaining", { icon: "⏱️" });
    }

    if (remaining === 0) {
      handleAutoSubmit();
    }
  }, [remaining, attemptId, timerReady]);

  /* ===== VISIT ===== */

  useEffect(() => {
    if (!attemptId || !currentQuestion?._id) return;
    if (currentQuestion.state?.isVisited) return;

    const qid = currentQuestion._id;

    // optimistic
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q._id === qid ? { ...q, state: { ...q.state, isVisited: true } } : q,
        ),
      })),
    );

    axios
      .put(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${qid}/visit`,
        {},
        { withCredentials: true },
      )
      .catch(() => {});
  }, [attemptId, currentQuestion?._id]);

  /* ===== ANSWER ===== */

  const debouncedSaveRef = useRef(null);

  useEffect(() => {
    debouncedSaveRef.current = debounce((qid, payload) => {
      axios
        .put(
          `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${qid}/answer`,
          payload,
          { withCredentials: true },
        )
        .catch(() => {});
    }, 500);

    return () => debouncedSaveRef.current?.cancel();
  }, [attemptId]);

  const handleAnswer = (selectedOptions, numericAnswer) => {
    const limit = currentSection?.questionsToAttempt;
    const alreadyAnswered = currentQuestion?.state?.isAnswered;

    if (limit !== null && !alreadyAnswered && sectionAnsweredCount >= limit) {
      toast(
        `You can attempt only ${limit} question${limit > 1 ? "s" : ""} in this section. Clear one to select another.`,
        { icon: null },
      );
      return;
    }

    const qid = currentQuestion._id;
    const qType = currentQuestion.questionType;

    // optimistic UI
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q._id === qid
            ? {
                ...q,
                state: {
                  ...q.state,
                  isAnswered: true,
                  selectedOptions,
                  numericAnswer,
                },
              }
            : q,
        ),
      })),
    );

    // debounced backend save
    debouncedSaveRef.current?.(qid, {
      questionType: qType,
      selectedOptions,
      numericAnswer,
      isMarkedForReview: currentQuestion.state?.isMarkedForReview || false,
    });
  };

  /* ===== MARK ===== */

  const toggleMark = () => {
    const qid = currentQuestion._id;
    const newVal = !currentQuestion.state?.isMarkedForReview;

    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q._id === qid
            ? { ...q, state: { ...q.state, isMarkedForReview: newVal } }
            : q,
        ),
      })),
    );

    axios
      .put(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${qid}/answer`,
        {
          questionType: currentQuestion.questionType,
          selectedOptions: currentQuestion.state?.selectedOptions || [],
          numericAnswer: currentQuestion.state?.numericAnswer || null,
          isMarkedForReview: newVal,
        },
        { withCredentials: true },
      )
      .catch(() => {});
  };

  /* ===== CLEAR ===== */

  const clearAnswer = () => {
    const qid = currentQuestion._id;

    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q._id === qid
            ? {
                ...q,
                state: {
                  ...q.state,
                  isAnswered: false,
                  selectedOptions: [],
                  numericAnswer: null,
                },
              }
            : q,
        ),
      })),
    );

    axios
      .put(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${qid}/answer`,
        {
          questionType: currentQuestion.questionType,
          selectedOptions: [],
          numericAnswer: null,
          isMarkedForReview: currentQuestion.state?.isMarkedForReview || false,
        },
        { withCredentials: true },
      )
      .catch(() => {});
  };

  /* ===== SUBMIT ===== */

  const handleSubmit = async (auto = false) => {
    if (submitState !== "IDLE") return;

    try {
      setAutoSubmitted(auto);
      setSubmitState("SUBMITTING");

      await axios.post(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}/submit`,
        {},
        { withCredentials: true },
      );

      setSubmitState("SUBMITTED");
      setExamActive(false);
    } catch (e) {
      console.error("Submit failed", e);
      setSubmitState("IDLE");
    }
  };

  const submitTest = () => handleSubmit(false);
  const handleAutoSubmit = () => handleSubmit(true);

  /* ===== PREVIOUS AND NEXT ===== */

  const goNext = () => {
    if (!sections.length) return;

    const isLastQuestion = qIndex === currentQuestions.length - 1;

    const isLastSection = activeSection === sections.length - 1;

    // normal next
    if (!isLastQuestion) {
      setQIndex((i) => i + 1);
      return;
    }

    // last question → next section
    if (!isLastSection) {
      setActiveSection((s) => s + 1);
      setQIndex(0);
      return;
    }

    // last question of last section
    toast("You are at the last question of the test.", { icon: null });
  };

  const goPrev = () => {
    if (!sections.length) return;

    const isFirstQuestion = qIndex === 0;

    if (!isFirstQuestion) {
      setQIndex((i) => i - 1);
      return;
    }

    // move to previous section last question
    if (activeSection > 0) {
      const prevSection = sections[activeSection - 1];
      setActiveSection((s) => s - 1);
      setQIndex(prevSection.questions.length - 1);
    }
  };

  if (loading)
    return (
      <div
        className={`${theme === "dark" ? "dark" : ""} h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
      >
        <div className="flex space-x-2">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
        </div>
      </div>
    );

  if (error) {
    return (
      <ErrorScreen
        error={error}
        errorCode={errorCode}
        navigate={navigate}
        theme={theme}
      />
    );
  }

  if (submitState === "SUBMITTING") {
    return <SubmittingScreen auto={autoSubmitted} />;
  }

  if (submitState === "SUBMITTED") {
    return (
      <SubmitSuccessScreen
        attemptId={attemptId}
        testId={testId}
        navigate={navigate}
      />
    );
  }

  if (showExpiredScreen) {
    return (
      <ExpiredScreen theme={theme} onViewResult={handleViewExpiredResult} />
    );
  }

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-200 select-none`}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 md:p-10">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2600,
            style:
              theme === "dark"
                ? {
                    background: "#1f2937",
                    color: "#f9fafb",
                    fontSize: "13px",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                    textAlign: "center",
                  }
                : {
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "13px",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    textAlign: "center",
                  },
          }}
        />

        {/* Exit full screen warning */}
        {showFullscreenWarning && (
          <FullscreenWarning
            theme={theme}
            onClose={() => setShowFullscreenWarning(false)}
          />
        )}

        <ExamHeader
          title={mockTest?.title}
          remaining={remaining}
          currentSection={currentSection}
          sectionAnsweredCount={sectionAnsweredCount}
          stats={stats}
        />

        <SectionTabs
          sections={sections}
          active={activeSection}
          setActive={(i) => {
            setActiveSection(i);
            setQIndex(0);
          }}
        />

        <Palette
          questions={currentQuestions}
          currentIndex={qIndex}
          setIndex={setQIndex}
        />

        {currentQuestion && (
          <QuestionView
            q={currentQuestion}
            answer={
              currentQuestion.questionType === "NAT"
                ? currentQuestion.state?.numericAnswer
                : currentQuestion.state?.selectedOptions
            }
            onAnswer={handleAnswer}
          />
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* left actions */}
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-2">
            <Button
              variant="ghost"
              onClick={goPrev}
              className="w-full md:w-auto"
            >
              Previous Question
            </Button>

            <Button
              variant="success"
              onClick={goNext}
              className="w-full md:w-auto"
            >
              Next Question
            </Button>

            <Button
              variant="purple"
              onClick={toggleMark}
              className="w-full md:w-auto"
            >
              Mark For Review
            </Button>

            <Button
              variant="danger"
              onClick={clearAnswer}
              className="w-full md:w-auto"
            >
              Clear Response
            </Button>
          </div>

          {/* submit */}
          <Button
            variant="primary"
            onClick={() => setShowSubmitModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Submit
          </Button>
        </div>

        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-lg mx-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-700">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
                  <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Submit Test
                </h2>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  Once submitted, you will{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    not be able to change
                  </span>{" "}
                  your answers.
                </p>

                {/* ===== Stats Box ===== */}
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-zinc-600 p-4 bg-gray-50 dark:bg-zinc-800/40">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <Stat
                      label="Answered"
                      value={stats.answered}
                      color="text-green-600"
                    />
                    <Stat
                      label="Not Answered"
                      value={stats.notAnswered}
                      color="text-orange-500"
                    />
                    <Stat
                      label="Marked"
                      value={stats.markedOnly}
                      color="text-purple-600"
                    />
                    <Stat
                      label="Marked & Answered"
                      value={stats.answeredMarked}
                      color="text-purple-600"
                    />
                    <Stat
                      label="Not Visited"
                      value={stats.notVisited}
                      color="text-gray-500"
                    />
                  </div>
                </div>

                {sectionStats.some((s) => s.limit !== null) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-600 space-y-1 text-xs">
                    {sectionStats.map((s, i) =>
                      s.limit !== null ? (
                        <div key={i} className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            {s.title}
                          </span>
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {s.answered}/{s.limit}
                          </span>
                        </div>
                      ) : null,
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please review unanswered or marked questions before
                  confirming.
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                  Review
                </button>

                <button
                  onClick={async () => {
                    setShowSubmitModal(false);
                    await submitTest();
                  }}
                  className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium shadow-sm"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
