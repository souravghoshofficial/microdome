import Razorpay from "razorpay";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import crypto from "crypto";
import {
  sendCourseConfirmationEmail,
  sendQuizConfirmationEmail,
} from "../utils/sendEmail.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import { Coupon } from "../models/coupon.model.js";
import { MonthlyFee } from "../models/monthlyFee.model.js";
import { mockTestBundleEnrollment } from "../models/mockTestBundleEnrollment.model.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { itemId, itemType, amount, mobileNumber, instituteName, presentCourseOfStudy } = req.body;

  try {
    // ✅ Validate itemType
    if (!itemType || !["course", "quiz", "mock_test_bundle"].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing itemType. Must be 'course' or 'quiz' or mock_test_bundle.",
      });
    }

    const options = {
      amount: Number(amount) * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
      notes: {
        userId: req.user._id,
        itemType: itemType,
        itemId: itemId || "", // may be empty for quiz
      },
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }

    // ✅ Save order in DB
    const newOrder = new Order({
      userId: req.user._id,
      itemType,
      amount,
      razorpayOrderId: order.id,
      razorpayPaymentId: "", // will be updated after verification
      status: "Pending",
    });
    await newOrder.save();

    // ✅ Update user phone if provided
    if (mobileNumber) {
      await User.findByIdAndUpdate(
        req.user._id,
        { mobileNumber: mobileNumber },
        { new: true },
      );
    }

    // ✅ Update institute if provided
    if (instituteName) {
      await User.findByIdAndUpdate(
        req.user._id,
        { instituteName: instituteName },
        { new: true },
      );
    }

    if (presentCourseOfStudy) {
      await User.findByIdAndUpdate(
        req.user._id,
        { presentCourseOfStudy: presentCourseOfStudy },
        { new: true },
      );
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid signature, possible spoofing attempt");
      return res
        .status(200)
        .json({ success: false, message: "Invalid signature" });
    }

    const event = req.body;

    if (event.event !== "payment.captured") {
      console.warn("Ignored non-payment event:", event.event);
      return res
        .status(200)
        .json({ success: false, message: "Unexpected event" });
    }

    const payment = event.payload.payment.entity;

    // Find order
    const order = await Order.findOne({ razorpayOrderId: payment.order_id });

    if (!order) {
      console.error("Order not found for payment:", payment.order_id);
      return res
        .status(200)
        .json({ success: false, message: "Order not found" });
    }

    // Update order
    order.razorpayPaymentId = payment.id;

    order.status = "Completed";
    await order.save();

    // Get user
    const user = await User.findById(order.userId);
    
    if (!user) {
      console.error("User not found for order:", order._id);
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    // Handle itemType
    if (order.itemType === "course") {
      user.isPremiumMember = true;

      if (!user.enrolledCourses.includes(order.itemId)) {
        user.enrolledCourses.push(order.itemId);
      }
      await user.save();

      const courseDetails = await Course.findById(order.itemId);

      await CourseEnrollment.create({
        courseId: courseDetails._id,
        userId: user._id,
      });

      // Only for LIVE courses
      if (courseDetails.mode?.toLowerCase() === "live") {
        const MONTH_KEYS = [
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec",
        ];

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthKey = MONTH_KEYS[currentDate.getMonth()];

        // Check if already exists (important safeguard)
        const exists = await MonthlyFee.findOne({
          userId: user._id,
          courseId: courseDetails._id,
          year: currentYear,
        });

        if (!exists) {
          await MonthlyFee.create({
            userId: user._id,
            courseId: courseDetails._id,
            year: currentYear,
            startedFromMonth: currentMonthKey,
          });
        }
      }

      // 1. Send course confirmation email
      await sendCourseConfirmationEmail({
        to: user.email,
        studentName: user.name,
        courseTitle: courseDetails.courseTitle,
        accessLink: `https://microdomeclasses.in/my-courses/${courseDetails._id}`,
        whatsappLink: courseDetails.whatsappLink,
      });

      // 2. Check if this course is an MSc Entrance batch
      const MSC_ENTRANCE_BATCH_IDS = [
        "68a3910c37c7e92815cbac12",
        "68a6cdeefa66a524a5255dcd",
      ];

      if (MSC_ENTRANCE_BATCH_IDS.includes(order.itemId.toString())) {
        user.hasAccessToQuizzes = true;
        await user.save();

        // Send quiz confirmation email
        await sendQuizConfirmationEmail({
          to: user.email,
          studentName: user.name,
          quizLink: "https://microdomeclasses.in/quizzes",
        });
      }
    } else if (order.itemType === "quiz") {
      user.hasAccessToQuizzes = true;
      await user.save();

      await sendQuizConfirmationEmail({
        to: user.email,
        studentName: user.name,
        quizLink: "https://microdomeclasses.in/quizzes",
      });
    } else if(order.itemType === "mock_test_bundle") {
      const mockTestBundleEnrollment = await mockTestBundleEnrollment.create({
        bundleId: order.itemId,
        userId: user._id
      })
      //mock test confirmation email 
    }

    // Always respond 200 to Razorpay
    return res.status(200).json({
      success: true,
      message: "Payment processed",
      razorpay_order_id: payment.order_id,
      razorpay_payment_id: payment.id,
    });
  } catch (error) {
    console.error("Error in webhook processing:", error);

    // Still respond 200 to Razorpay, just mark as failed internally
    return res.status(200).json({
      success: false,
      message: "Internal error while processing payment",
    });
  }
};

export const validateCouponCode = async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;

    if (!courseId || !couponCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Convert to lowercase before checking
    const normalizedCode = couponCode.toLowerCase();

    // Find coupon by courseId and normalized couponCode
    const coupon = await Coupon.findOne({
      courseId,
      couponCode: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      discount: coupon.discount,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export { createOrder, verifyPayment };
