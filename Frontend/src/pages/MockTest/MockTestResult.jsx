import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  XCircle,
  Circle,
  Clock,
  Award,
  Hash,
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

        <div className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
          Attempt {attemptNumber}
        </div>
      </div>
    </div>
  );
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

/* ================= OPTION STYLE ================= */

function getOptionStyle(isCorrect, isSelected) {
  // selected & correct → GREEN
  if (isSelected && isCorrect)
    return "border-green-500 bg-green-50 dark:bg-green-500/10";

  // selected & wrong → RED
  if (isSelected && !isCorrect)
    return "border-red-500 bg-red-50 dark:bg-red-500/10";

  // correct but not selected → BLUE
  if (!isSelected && isCorrect)
    return "border-blue-500 bg-blue-50 dark:bg-blue-500/10";

  // neutral
  return "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900";
}

/* ================= LEGEND ================= */

function ResultLegend() {
  return (
    <div className="flex items-center gap-4 text-xs md:text-sm">
      {/* Your answer = correct */}
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-green-500 inline-block" />
        <span className="text-gray-700 dark:text-gray-300">
          Your answer = Correct
        </span>
      </div>

      {/* Your answer = wrong */}
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-red-500 inline-block" />
        <span className="text-gray-700 dark:text-gray-300">
          Your answer = Wrong
        </span>
      </div>

      {/* Correct answer */}
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
        <span className="text-gray-700 dark:text-gray-300">Correct answer</span>
      </div>
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
      {/* header */}
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

      {/* text */}
      <div className="mb-4 text-gray-900 dark:text-gray-100">
        {q.questionText}
      </div>

      {/* image */}
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

      {/* explanation */}
      {q.answerExplanation && (
        <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
          <div className="flex">
            {/* accent bar */}
            <div className="w-1.5 rounded-l-lg bg-blue-600" />

            {/* content */}
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

/* ================= MAIN ================= */

export default function MockTestResult() {
  const { testId } = useParams();
  const theme = useSelector((s) => s.theme.theme);

  const [data, setData] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    fetchResult();
  }, [attempt]);

  const fetchResult = async () => {
    const url = attempt
      ? `${ApiUrl}/user/mock-tests/${testId}/result?attempt=${attempt}`
      : `${ApiUrl}/user/mock-tests/${testId}/result`;

    const res = await axios.get(url, {
      withCredentials: true,
    });

    setData(res.data);
    setActiveSection(0);
  };

  if (!data) {
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

  const { mockTest, result, sections, attempts, selectedAttemptNumber } = data;
  const section = sections[activeSection];

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-950`}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
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
          {/* left stats */}
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

          {/* legend */}
          <ResultLegend />
        </div>

        {section.questions.map((q) => (
          <QuestionResult key={q._id} q={q} />
        ))}
      </div>
    </div>
  );
}
