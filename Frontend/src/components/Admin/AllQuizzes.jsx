// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { Plus, Pencil, Trash } from "lucide-react";
// import { Link } from "react-router";
// import { useSelector } from "react-redux"

// const ApiUrl = import.meta.env.VITE_BACKEND_URL;

// const AllQuizzes = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [quizzesPerPage] = useState(8);

//   const user = useSelector((state) => state.auth.userData)

//   // Modal state
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [quizToDelete, setQuizToDelete] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     fetchQuizzes();
//   }, []);

//   const fetchQuizzes = () => {
//     axios
//       .get(`${ApiUrl}/admin/quizzes`, { withCredentials: true })
//       .then((res) => {
//         if (res.data.success && Array.isArray(res.data.data)) {
//           setQuizzes(res.data.data);
//         } else {
//           toast.error(res.data.message || "No quizzes found");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching quizzes:", err);
//         toast.error("Failed to load quizzes");
//       });
//   };

//   const openDeleteModal = (quiz) => {
//     setQuizToDelete(quiz);
//     setDeleteModalOpen(true);
//   };

//   const closeDeleteModal = () => {
//     setQuizToDelete(null);
//     setDeleteModalOpen(false);
//   };

//   const handleDelete = async () => {
//     if (!quizToDelete) return;

//     setDeleting(true);
//     try {
//       const res = await axios.delete(
//         `${ApiUrl}/admin/quiz/${quizToDelete._id}`,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         setQuizzes((prev) =>
//           prev.filter((quiz) => quiz._id !== quizToDelete._id)
//         );
//         toast.success(res.data.message || "Quiz deleted successfully");
//         closeDeleteModal();
//       } else {
//         toast.error(res.data.message || "Failed to delete quiz");
//       }
//     } catch (err) {
//       console.error("Error deleting quiz:", err);
//       toast.error("Error deleting quiz");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // Pagination calculations
//   const indexOfLastQuiz = currentPage * quizzesPerPage;
//   const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
//   const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
//   const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

//   return (
//     <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="flex flex-row justify-between items-center px-4 md:px-6 py-4 border-b gap-3">
//         <h2 className="text-base md:text-lg font-semibold">All Quizzes</h2>
//         <div className="flex items-center justify-center gap-4">
//           {user?.role === "admin" && <Link to="/admin/reset-quiz-price" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow text-sm md:text-base cursor-pointer">Reset Quiz Price</Link>}
//         <Link
//           to="/admin/create-quiz"
//           className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-sm md:text-base cursor-pointer"
//         >
//           <Plus className="w-4 h-4" />
//           Create Quiz
//         </Link>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="flex-1 overflow-auto">
//         <div className="overflow-x-auto">
//           <table className="min-w-[800px] w-full border-collapse">
//             <thead className="bg-gray-100 sticky top-0 z-10">
//               <tr className="text-left text-gray-600 border-b text-sm md:text-base">
//                 <th className="px-4 py-2">Title</th>
//                 <th className="px-4 py-2 text-center">Category</th>
//                 <th className="px-4 py-2 text-center whitespace-nowrap">
//                   No. of Questions
//                 </th>
//                 <th className="px-4 py-2 text-center whitespace-nowrap">
//                   Time (mins)
//                 </th>
//                 <th className="px-4 py-2 text-center whitespace-nowrap">
//                   Attempted By
//                 </th>
//                 <th className="px-4 py-2 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentQuizzes.length > 0 ? (
//                 currentQuizzes.map((quiz) => (
//                   <tr
//                     key={quiz._id}
//                     className="border-b hover:bg-gray-50 text-xs md:text-sm"
//                   >
//                     <td className="px-4 py-3 font-medium">{quiz.title}</td>
//                     <td className="px-4 py-3 text-center capitalize">
//                       {quiz.category}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       {quiz.noOfQuestions}
//                     </td>
//                     <td className="px-4 py-3 text-center">{quiz.time} min</td>
//                     <td className="px-4 py-3 text-center">
//                       {quiz.attemptedBy}
//                     </td>
//                     <td className="px-4 py-3 text-center flex justify-center gap-2">
//                       <Link
//                         className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm cursor-pointer"
//                         to={`/admin/edit-quiz/${quiz._id}`}
//                       >
//                         <Pencil className="w-4 h-4" /> Edit
//                       </Link>
//                       <Link
//                         className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm cursor-pointer"
//                         to={`/admin/quiz-result/${quiz._id}`}
//                       >
//                         View Results
//                       </Link>
//                       <button
//                         onClick={() => openDeleteModal(quiz)}
//                         className="bg-red-500 hover:bg-red-600 text-white p-2 rounded cursor-pointer"
//                       >
//                         <Trash className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="text-center py-6 text-gray-500 text-sm"
//                   >
//                     No quizzes found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {quizzes.length > quizzesPerPage && (
//         <div className="flex justify-center items-center gap-2 py-4 border-t">
//           <button
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//           >
//             Prev
//           </button>

//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded cursor-pointer ${
//                 currentPage === i + 1
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {deleteModalOpen && quizToDelete && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Delete Quiz
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete{" "}
//               <span className="font-medium text-red-500">
//                 {quizToDelete.title}
//               </span>
//               ? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closeDeleteModal}
//                 disabled={deleting}
//                 className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:opacity-50 cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={deleting}
//                 className={`px-4 py-2 rounded text-white ${
//                   deleting
//                     ? "bg-red-300 cursor-not-allowed"
//                     : "bg-red-500 hover:bg-red-600 cursor-pointer"
//                 }`}
//               >
//                 {deleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllQuizzes;


import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Pencil, Trash, Share2 } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const AllQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(8);

  const user = useSelector((state) => state.auth.userData);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    axios
      .get(`${ApiUrl}/admin/quizzes`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setQuizzes(res.data.data);
        } else {
          toast.error(res.data.message || "No quizzes found");
        }
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
        toast.error("Failed to load quizzes");
      });
  };

  const openDeleteModal = (quiz) => {
    setQuizToDelete(quiz);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setQuizToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!quizToDelete) return;

    setDeleting(true);
    try {
      const res = await axios.delete(
        `${ApiUrl}/admin/quiz/${quizToDelete._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setQuizzes((prev) =>
          prev.filter((quiz) => quiz._id !== quizToDelete._id)
        );
        toast.success(res.data.message || "Quiz deleted successfully");
        closeDeleteModal();
      } else {
        toast.error(res.data.message || "Failed to delete quiz");
      }
    } catch (err) {
      console.error("Error deleting quiz:", err);
      toast.error("Error deleting quiz");
    } finally {
      setDeleting(false);
    }
  };

  // Handle quiz share
  const handleShare = (quizId, title) => {
    const shareUrl = `https://microdomeclasses.in/quiz/${quizId}`;

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Take this quiz on Microdome Classes: ${title}`,
          url: shareUrl,
        })
        .then(() => console.log("Quiz shared successfully"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  // Pagination calculations
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-row justify-between items-center px-4 md:px-6 py-4 border-b gap-3">
        <h2 className="text-base md:text-lg font-semibold">All Quizzes</h2>
        <div className="flex items-center justify-center gap-4">
          {user?.role === "admin" && (
            <Link
              to="/admin/reset-quiz-price"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow text-sm md:text-base cursor-pointer"
            >
              Reset Quiz Price
            </Link>
          )}
          <Link
            to="/admin/create-quiz"
            className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-sm md:text-base cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Quiz
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm md:text-base">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2 text-center">Category</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  No. of Questions
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Time (mins)
                </th>
                <th className="px-4 py-2 text-center whitespace-nowrap">
                  Attempted By
                </th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQuizzes.length > 0 ? (
                currentQuizzes.map((quiz) => (
                  <tr
                    key={quiz._id}
                    className="border-b hover:bg-gray-50 text-xs md:text-sm"
                  >
                    <td className="px-4 py-3 font-medium">{quiz.title}</td>
                    <td className="px-4 py-3 text-center capitalize">
                      {quiz.category}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {quiz.noOfQuestions}
                    </td>
                    <td className="px-4 py-3 text-center">{quiz.time} min</td>
                    <td className="px-4 py-3 text-center">
                      {quiz.attemptedBy}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                      <Link
                        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs md:text-sm cursor-pointer"
                        to={`/admin/edit-quiz/${quiz._id}`}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </Link>
                      <Link
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm cursor-pointer"
                        to={`/admin/quiz-result/${quiz._id}`}
                      >
                        View Results
                      </Link>
                      <button
                        onClick={() => openDeleteModal(quiz)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded cursor-pointer"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare(quiz._id, quiz.title)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No quizzes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {quizzes.length > quizzesPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && quizToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Quiz
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-red-500">
                {quizToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-4 py-2 rounded text-white ${
                  deleting
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 cursor-pointer"
                }`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQuizzes;
