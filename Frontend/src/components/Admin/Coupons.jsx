import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import { Link } from "react-router"; 

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmCoupon, setConfirmCoupon] = useState(null);

  const couponsPerPage = 5;

  // Fetch all coupons
  useEffect(() => {
    axios
      .get(`${ApiUrl}/admin/coupons`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.coupons) {
          setCoupons(
            res.data.coupons.map((c) => ({
              id: c._id,
              code: c.couponCode || "---",
              discount: c.discount || 0,
              courseTitle: c.courseId?.cardTitle || "---", // ✅ show cardTitle instead of ID
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching coupons:", err);
        toast.error("Failed to load coupons");
      });
  }, []);

  const deleteCoupon = async (couponId) => {
    try {
      const { data } = await axios.post(
        `${ApiUrl}/admin/delete-coupon`,
        { couponId }, // send couponId in body
        { withCredentials: true }
      );

      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== couponId));
        toast.success("Coupon deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  // Pagination
  const indexOfLast = currentPage * couponsPerPage;
  const indexOfFirst = indexOfLast - couponsPerPage;
  const currentCoupons = coupons.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(coupons.length / couponsPerPage);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b">
        <h2 className="text-base md:text-lg font-semibold">All Coupons</h2>

       <Link
  to="/admin/create-coupon"
  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-sm md:text-base"
>
  <Plus className="w-4 h-4" />
  Create Coupon
</Link>
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b text-sm md:text-base">
                <th className="px-4 py-2">Coupon Code</th>
                <th className="px-4 py-2 text-center">Discount (%)</th>
                <th className="px-4 py-2 text-center">Course</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCoupons.length > 0 ? (
                currentCoupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b hover:bg-gray-50 text-xs md:text-sm"
                  >
                    <td className="px-4 py-3 font-medium">{coupon.code.toUpperCase()}</td>
                    <td className="px-4 py-3 text-center">
                      {coupon.discount}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      {coupon.courseTitle}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => setConfirmCoupon(coupon)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {coupons.length > couponsPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t">
          <button
            className="px-3 py-1 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
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
            className="px-3 py-1 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmCoupon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to{" "}
              <span className="text-red-600 font-semibold">delete</span> coupon{" "}
              <span className="font-medium">{confirmCoupon.code}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                onClick={() => setConfirmCoupon(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                onClick={() => {
                  deleteCoupon(confirmCoupon.id);
                  setConfirmCoupon(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
