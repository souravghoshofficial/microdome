import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

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

function Button({ children, onClick, variant = "primary", className = "" }) {
  const base = "px-4 py-1.5 rounded-xl font-medium transition";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-gray-200 dark:bg-gray-800",
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
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (!startedAt || !durationSeconds) return;
    const end = new Date(startedAt).getTime() + durationSeconds * 1000;
    const id = setInterval(() => {
      setRemaining(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    }, 1000);
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
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold ${color} relative`}
      >
        {count}
        {isAnsweredMarked && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
        )}
      </div>
      <div className="text-sm flex flex-col items-center">
        <span className="text-gray-700 dark:text-gray-300">{text}</span>
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
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
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
    <Card className="p-6 mb-6">
      <div className="mb-4 font-semibold flex items-center justify-between">
        Question {q.questionOrder}
        <span className="ml-3 text-sm font-normal text-gray-500">
          ({q.marks} marks)
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

  const [attemptId, setAttemptId] = useState(null);
  const [mockTest, setMockTest] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  const remaining = useExamTimer(startedAt, durationSeconds);

  const currentSection = sections[activeSection];
  const currentQuestions = currentSection?.questions || [];
  const currentQuestion = currentQuestions[qIndex];

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

  /* ===== INIT ===== */

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const startRes = await axios.post(
      `${ApiUrl}/user/mock-tests/${testId}/start`,
      {},
      { withCredentials: true },
    );

    const { attemptId, startedAt, durationSeconds, mockTest } = startRes.data;
    setAttemptId(attemptId);
    setStartedAt(startedAt);
    setDurationSeconds(durationSeconds);
    setMockTest(mockTest);

    const sessionRes = await axios.get(
      `${ApiUrl}/user/mock-tests/attempt/${attemptId}`,
      { withCredentials: true },
    );

    setSections(sessionRes.data.sections);
    const first = sessionRes.data.sections?.[0]?.questions?.[0];
    if (first && !first.state?.isVisited) {
      axios.put(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${first._id}/visit`,
        {},
        { withCredentials: true },
      );
    }
    setLoading(false);
  };

  /* ===== VISIT ===== */

  useEffect(() => {
    if (!attemptId || !currentQuestion?._id) return;

    // already visited → skip
    if (currentQuestion.state?.isVisited) return;

    markVisited(currentQuestion._id);
  }, [attemptId, currentQuestion?._id]);

  const markVisited = async (qid) => {
    try {
      await axios.put(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${qid}/visit`,
        {},
        { withCredentials: true },
      );

      // update local state instantly (no refetch)
      setSections((prev) =>
        prev.map((sec) => ({
          ...sec,
          questions: sec.questions.map((q) =>
            q._id === qid
              ? { ...q, state: { ...q.state, isVisited: true } }
              : q,
          ),
        })),
      );
    } catch (e) {
      console.error("visit update failed", e);
    }
  };

  /* ===== ANSWER ===== */

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

    // optimistic update
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q._id === qid ? { ...q, state: { ...q.state, isAnswered: true } } : q,
        ),
      })),
    );

    saveAnswer(qid, selectedOptions, numericAnswer);
  };

  const saveAnswer = async (qid, selectedOptions, numericAnswer) => {
    const res = await axios.put(
      `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${qid}/answer`,
      {
        questionType: currentQuestion.questionType,
        selectedOptions,
        numericAnswer,
        isMarkedForReview: currentQuestion.state?.isMarkedForReview || false,
      },
      { withCredentials: true },
    );

    // 🔄 update section state locally
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q._id === qid ? { ...q, state: res.data.answer } : q,
        ),
      })),
    );
  };

  /* ===== MARK ===== */

  const toggleMark = async () => {
    const newVal = !currentQuestion.state?.isMarkedForReview;

    await axios.put(
      `${ApiUrl}/user/mock-tests/attempt/${attemptId}/question/${currentQuestion._id}/answer`,
      {
        questionType: currentQuestion.questionType,
        selectedOptions: currentQuestion.state?.selectedOptions || [],
        numericAnswer: currentQuestion.state?.numericAnswer || null,
        isMarkedForReview: newVal,
      },
      { withCredentials: true },
    );

    currentQuestion.state.isMarkedForReview = newVal;
    setSections([...sections]);
  };

  /* ===== CLEAR ===== */

  const clearAnswer = async () => {
    const qid = currentQuestion._id;

    // 🔄 optimistic update FIRST
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q._id === qid
            ? { ...q, state: { ...q.state, isAnswered: false } }
            : q,
        ),
      })),
    );

    // then backend
    await saveAnswer(qid, [], null);
  };

  /* ===== SUBMIT ===== */

  const submitTest = async () => {
    await axios.post(
      `${ApiUrl}/user/mock-tests/attempt/${attemptId}/submit`,
      {},
      { withCredentials: true },
    );
    alert("Test submitted");
  };

  if (loading)
    return (
      <div
        className={`${theme === "dark" ? "dark" : ""} h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 dark:text-gray-200`}
      >
        Loading…
      </div>
    );

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-200`}
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

        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="ghost"
              onClick={() => setQIndex((i) => Math.max(0, i - 1))}
            >
              Previous
            </Button>
            <Button
              variant="success"
              onClick={() =>
                setQIndex((i) => Math.min(currentQuestions.length - 1, i + 1))
              }
            >
              Save & Next
            </Button>
            <Button variant="purple" onClick={toggleMark}>
              Mark For Review
            </Button>
            <Button variant="danger" onClick={clearAnswer}>
              Clear Response
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={submitTest}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
