import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import userImage from "../../assets/user-img.jpeg";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const MONTHS = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "may", label: "May" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "oct", label: "Oct" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
];

const formatPaidDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const getMonthIndex = (monthKey) => MONTHS.findIndex((m) => m.key === monthKey);

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH_KEY = MONTHS[new Date().getMonth()].key;

const MonthlyFeeSheet = () => {
  const { courseId } = useParams();
  const [year, setYear] = useState(CURRENT_YEAR);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${ApiUrl}/admin/monthly-fee/course/${courseId}?year=${year}`,
        { withCredentials: true },
      );
      setRecords(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load monthly fee sheet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [courseId, year]);

  const markPaid = async (userId, monthKey) => {
    try {
      await axios.patch(
        `${ApiUrl}/admin/monthly-fee/mark-paid`,
        { userId, courseId, year, month: monthKey },
        { withCredentials: true },
      );

      setRecords((prev) =>
        prev.map((r) =>
          r.userId._id === userId
            ? {
                ...r,
                months: {
                  ...r.months,
                  [monthKey]: {
                    paid: true,
                    paidAt: new Date().toISOString(),
                  },
                },
              }
            : r,
        ),
      );

      toast.success("Marked as paid");
    } catch {
      toast.error("Failed to mark as paid");
    }
  };

  const markUnpaid = async (userId, monthKey) => {
    try {
      await axios.patch(
        `${ApiUrl}/admin/monthly-fee/mark-unpaid`,
        { userId, courseId, year, month: monthKey },
        { withCredentials: true },
      );

      setRecords((prev) =>
        prev.map((r) =>
          r.userId._id === userId
            ? {
                ...r,
                months: {
                  ...r.months,
                  [monthKey]: {
                    paid: false,
                    paidAt: null,
                  },
                },
              }
            : r,
        ),
      );

      toast.success("Marked as unpaid");
    } catch {
      toast.error("Failed to mark as unpaid");
    }
  };


  const handleInit = async () => {
  try {
    const res = await axios.post(
      `${ApiUrl}/admin/monthly-fee/init-year`,
      { courseId, year },
      { withCredentials: true }
    );

    toast.success(
      `Initialized (${res.data.createdCount} records)`
    );

    fetchFees();
  } catch (err) {
    toast.error("Failed to initialize sheet");
  }
};


  return (
    <div className="h-[90vh] flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 border-b">
        <h2 className="text-lg font-semibold">Monthly Fee Sheet – {records[0]?.courseId?.courseTitle || "Course"}</h2>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-3 py-1.5 text-sm cursor-pointer"
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-none">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-sm text-gray-600 border-b">
              <th className="px-4 py-2 text-left">Student</th>
              {MONTHS.map((m) => (
                <th key={m.key} className="px-3 py-2 text-center">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : records.length === 0 ? (
              year === CURRENT_YEAR ? (
                <tr>
                  <td colSpan="13" className="text-center py-6 text-gray-500">
                    No records found for {year}. Click "Initialize Sheet" to create monthly fee records for all enrolled students.
                    <div className="mt-4">
                      <button
                        onClick={handleInit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Initialize Sheet
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="13" className="text-center py-6 text-gray-500">
                    No records found for {year}.
                  </td>
                </tr>
              )
            ) : (
              records.map((record) => (
                <tr
                  key={record._id}
                  className="border-b hover:bg-gray-50 text-sm"
                >
                  {/* User */}
                  <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                    <img
                      src={record.userId.profileImage || userImage}
                      alt={record.userId.name}
                      className={`w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ${
                        record.months[CURRENT_MONTH_KEY]?.paid
                          ? "ring-green-500"
                          : "ring-red-500"
                      }`}
                    />

                    <div>
                      <p className="font-medium">{record.userId.name}</p>
                      <p className="text-xs text-gray-500">
                        {record.userId.email}
                      </p>
                    </div>
                  </td>

                  {/* Months */}
                  {MONTHS.map((m) => {
                    const paid = record.months[m.key]?.paid;

                    const startIndex = getMonthIndex(record.startedFromMonth);
                    const currentIndex = getMonthIndex(m.key);

                    const isBeforeStart = currentIndex < startIndex;

                    return (
                      <td
                        key={m.key}
                        className="px-3 py-2 text-center align-middle"
                      >
                        <div className="flex flex-col items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            disabled={isBeforeStart}
                            onClick={() =>
                              !isBeforeStart &&
                              (paid
                                ? markUnpaid(record.userId._id, m.key)
                                : markPaid(record.userId._id, m.key))
                            }
                            checked={paid}
                            className={`w-5 h-5 cursor-pointer disabled:cursor-not-allowed ${
                              isBeforeStart
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              isBeforeStart
                                ? "Not applicable (before enrollment)"
                                : paid
                                  ? "Paid"
                                  : "Unpaid"
                            }
                          />

                          {paid && !isBeforeStart && (
                            <span className="text-[10px] text-gray-500 leading-none">
                              {formatPaidDate(record.months[m.key]?.paidAt)}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyFeeSheet;
