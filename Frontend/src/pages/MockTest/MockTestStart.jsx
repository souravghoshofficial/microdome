import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Clock, CheckCircle2 } from "lucide-react";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

// =====================================================
// UI PRIMITIVES
// =====================================================
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

// =====================================================
// TIMER
// =====================================================
function useExamTimer(startedAt, durationSeconds) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (!startedAt || !durationSeconds) return;
    const end = new Date(startedAt).getTime() + durationSeconds * 1000;
    const tick = () =>
      setRemaining(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, durationSeconds]);

  return remaining;
}

// =====================================================
// HEADER
// =====================================================
function ExamHeader({ title, remaining, stats }) {
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge color="blue">Attempted: {stats.attempted}</Badge>
          <Badge color="purple">Marked For Review: {stats.marked}</Badge>
          <Badge color="gray">Remaining: {stats.remaining}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-xl font-mono">
        <Clock className="w-5 h-5" />
        {`${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`}
      </div>
    </div>
  );
}

function Badge({ children, color = "blue" }) {
  const map = {
    blue: "bg-blue-500/10 text-blue-600",
    purple: "bg-purple-500/10 text-purple-600",
    gray: "bg-gray-500/10 text-gray-600",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${map[color]}`}>
      {children}
    </span>
  );
}

// =====================================================
// SECTION TABS
// =====================================================
function SectionTabs({ sections, active, setActive }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {sections.map((s, i) => (
        <button
          key={s.sectionId}
          onClick={() => setActive(i)}
          className={`px-4 py-2 rounded-xl whitespace-nowrap border transition ${
            i === active
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          }`}
        >
          {s.sectionTitle}
        </button>
      ))}
    </div>
  );
}

// =====================================================
// QUESTION PALETTE
// =====================================================
function Palette({ questions, answers, marked, currentIndex, setIndex }) {
  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {questions.map((q, i) => {
          const attempted =
            answers[q._id] !== undefined && answers[q._id] !== "";
          const isMarked = marked[q._id];
          const isActive = i === currentIndex;

          let cls =
            "border rounded-lg text-sm h-9 flex items-center justify-center";
          if (isActive) cls += " bg-blue-600 text-white";
          else if (isMarked) cls += " bg-purple-500 text-white";
          else if (attempted) cls += " bg-green-500 text-white";
          else cls += " bg-gray-200 dark:bg-gray-800";

          return (
            <button key={q._id} className={cls} onClick={() => setIndex(i)}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// =====================================================
// QUESTION VIEW
// =====================================================
function QuestionView({ q, answer, setAnswer }) {
  const toggle = (label) => {
    if (q.questionType === "MCQ") setAnswer(q._id, label);
    else if (q.questionType === "MSQ") {
      const arr = answer || [];
      setAnswer(
        q._id,
        arr.includes(label) ? arr.filter((x) => x !== label) : [...arr, label],
      );
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="mb-4 font-semibold">Question {q.questionOrder}</div>
      <div className="mb-4">{q.questionText}</div>

      {q.questionType !== "NAT" && (
        <div className="grid gap-2">
          {q.options.map((op) => (
            <div
              key={op.label}
              onClick={() => toggle(op.label)}
              className={`border rounded-xl p-3 cursor-pointer ${
                q.questionType === "MCQ"
                  ? answer === op.label
                    ? "bg-blue-50 border-blue-500"
                    : ""
                  : answer?.includes(op.label)
                    ? "bg-blue-50 border-blue-500"
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
          onChange={(e) => setAnswer(q._id, e.target.value)}
          className="border rounded-lg px-3 py-2 w-40"
        />
      )}
    </Card>
  );
}

// =====================================================
// ACTION BAR
// =====================================================
function ActionBar({ onPrev, onNext, onMark, onClear, onSubmit }) {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={onPrev}>
          Previous
        </Button>
        <Button variant="success" onClick={onNext}>
          Save & Next
        </Button>
        <Button variant="purple" onClick={onMark}>
          Mark For Review
        </Button>
        <Button variant="danger" onClick={onClear}>
          Clear
        </Button>
      </div>
      <Button className="flex items-center gap-2" variant="primary" onClick={onSubmit}>
        <CheckCircle2 className="w-4 h-4" /> Submit
      </Button>
    </div>
  );
}

// =====================================================
// MAIN
// =====================================================
export default function MockTestStart() {
  const { testId } = useParams();
  const theme = useSelector((s) => s.theme.theme);

  const [mockTest, setMockTest] = useState(null);
  const [sections, setSections] = useState([]);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  const remaining = useExamTimer(startedAt, durationSeconds);

  const currentSection = sections[activeSection];
  const currentQuestions = currentSection?.questions || [];
  const currentQuestion = currentQuestions[qIndex];

  const stats = useMemo(() => {
    const allQ = sections.flatMap((s) => s.questions);
    const attempted = allQ.filter(
      (q) => answers[q._id] !== undefined && answers[q._id] !== "",
    ).length;
    const markedCount = Object.values(marked).filter(Boolean).length;
    return {
      attempted,
      marked: markedCount,
      remaining: allQ.length - attempted,
    };
  }, [sections, answers, marked]);

  const setAnswer = (qid, val) => setAnswers((p) => ({ ...p, [qid]: val }));

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const startRes = await axios.post(
        `${ApiUrl}/user/mock-tests/${testId}/start`,
        {},
        { withCredentials: true },
      );
      if (startRes.data.expired) return alert("Exam expired");

      const { attemptId, startedAt, durationSeconds, mockTest } = startRes.data;
      setStartedAt(startedAt);
      setDurationSeconds(durationSeconds);
      setMockTest(mockTest);

      const sessionRes = await axios.get(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}`,
        { withCredentials: true },
      );
      setSections(sessionRes.data.sections);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-5xl mx-auto px-4 py-8 md:p-16">
        <ExamHeader
          title={mockTest?.title}
          remaining={remaining}
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
          answers={answers}
          marked={marked}
          currentIndex={qIndex}
          setIndex={setQIndex}
        />

        {currentQuestion && (
          <QuestionView
            q={currentQuestion}
            answer={answers[currentQuestion._id]}
            setAnswer={setAnswer}
          />
        )}

        <ActionBar
          onPrev={() => setQIndex((i) => Math.max(0, i - 1))}
          onNext={() =>
            setQIndex((i) => Math.min(currentQuestions.length - 1, i + 1))
          }
          onMark={() =>
            setMarked((m) => ({
              ...m,
              [currentQuestion._id]: !m[currentQuestion._id],
            }))
          }
          onClear={() => setAnswer(currentQuestion._id, "")}
          onSubmit={() => alert("submit")}
        />
      </div>
    </div>
  );
}
