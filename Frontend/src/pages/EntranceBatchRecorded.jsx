import {useEffect, useState} from "react";
import axios from "axios";
import { BuyNowCard , CourseSyllabus } from "../components";
import { loadRazorpayScript } from "../utils/razorpay";

const ApiUrl = import.meta.env.VITE_BACKEND_URL;


const EntranceBatchRecorded = () => {

  const [courseDetails, setCourseDetails] = useState(null)
  const [orderId, setOrderId] = useState("")

  
useEffect(() => {
  axios.get(`${ApiUrl}/api/v1/courses/get-all-courses`, {}, {withCredentials: true})
  .then((res) => {
    console.log(res.data.courses[0]);
    setCourseDetails(res.data.courses[0]);
  })
  .catch(() => console.log("Error fetching course details"))
}, [])

  const handlePayment = async () => {

  axios.post(`${ApiUrl}/api/v1/orders/create-order`, {
    courseId: courseDetails?._id, 
    amount: courseDetails?.price, 
  }, {
    withCredentials: true, 
  })
  .then((res) => {
    setOrderId(res.data.order.id)
  })
  .catch((err) => {
    console.log(err);
    return
  })


  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded) {
    alert("Razorpay SDK failed to load. Please try again later.");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
    amount: 100*(courseDetails?.price), // Amount in smallest currency unit
    currency: "INR",
    name: "Microdome Classes",
    description: "Payment for M.Sc Entrance Batch",
    image: "http://res.cloudinary.com/deljukiyr/image/upload/v1748880241/qi2txlfzapvqkqle8baa.jpg",
    order_id: orderId, 
    prefill: {
      name: "Microdome Classes",
      email: "microdomeclasses@gmail.com",
      contact: "8478805171", 
    },
    notes: {
      courseId: 123, 
      userId: "USER_ID", 
    },
  };
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mt-8 w-full lg:w-[90%] flex flex-col-reverse lg:flex-row justify-center lg:gap-10 lg:px-12 lg:py-6 mb-16">
        <div className="w-[90%] mx-auto lg:w-[60%] z-20 mt-16">
          <h3 className="mt-2 leading-10 text-2xl md:text-3xl font-bold">
            M.Sc. Entrance Mastery
          </h3>
          <h5 className="mt-2 w-[95%] text-[17px]">
            The most updated comprehensive recorded course covering everything
            from basics to advanced strategies for cracking IIT JAM, CUET PG,
            and other M.Sc. entrance exams — perfect for self-paced preparation.
          </h5>
          <div className="w-full mt-4">
            <CourseSyllabus />
          </div>
        </div>
        <div className="mt-16 lg:sticky h-fit top-32 w-[90%] mx-auto md:w-[50%] lg:w-[30%] z-20">
          <BuyNowCard actualPrice={courseDetails?.price} handlePayment={handlePayment}/>
        </div>
        
      </div>
    </div>
  );
};

export default EntranceBatchRecorded;
