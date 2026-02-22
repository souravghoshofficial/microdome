import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useFullscreen } from "../../hooks/useFullScreen";
import { useExamSecurity } from "../../hooks/useExamSecurity";
import { useTabSwitchWarning } from "../../hooks/useTabSwitchWarning";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MockTestStart = () => {
  const { testId } = useParams();

  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAttemptSession();
  }, []);

  const initAttemptSession = async () => {
    try {
      setLoading(true);

      // 1️⃣ start or resume
      const startRes = await axios.post(
        `${ApiUrl}/user/mock-tests/${testId}/start`,
        {},
        { withCredentials: true }
      );

      const { attemptId, resume, startedAt, durationMinutes } =
        startRes.data;

      setAttemptId(attemptId);

      // 2️⃣ fetch session
      const sessionRes = await axios.get(
        `${ApiUrl}/user/mock-tests/attempt/${attemptId}`,
        { withCredentials: true }
      );

      const { questions, answers } = sessionRes.data;

      setQuestions(questions);

      // convert answers array → map
      const ansMap = {};
      answers.forEach(a => {
        ansMap[a.questionId] = a.answer;
      });
      setAnswers(ansMap);

      // 3️⃣ restore timer
      const elapsed =
        Math.floor((Date.now() - new Date(startedAt)) / 1000);

      const total = durationMinutes * 60;
      setRemainingTime(total - elapsed);

    } catch (err) {
      console.error("Init attempt failed", err);
    } finally {
      setLoading(false);
    }
  };
};

export default MockTestStart;