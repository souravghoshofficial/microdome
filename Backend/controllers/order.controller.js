import Razorpay from 'razorpay';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import crypto from 'crypto';

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    const {courseId, amount} = req.body;  
    try {
        const options = {
            amount: Number(amount) * 100, // Amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
            notes: {
                courseId: courseId,
                userId: req.user._id
            },
        };

        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create order',
            });
        }

        // Save order details in the database
        const newOrder = new Order({
            user: req.user._id,
            course: courseId,
            amount: amount,
            razorpayOrderId: order.id,
            razorpayPaymentId: '', // This will be updated after payment
            status: 'Pending',
        });
        await newOrder.save();
       

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message,
        });
    }
}

const verifyPayment = async (req, res) => {
  // const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
  // console.log(razorpay_order_id , razorpay_signature);
  
  // try{
  //   const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  //     .update(razorpay_order_id + '|' + razorpay_payment_id)
  //     .digest('hex');

  //   if(generatedSignature !== razorpay_signature) {
  //     return res.status(400).json({
  //       success: false,
  //       message: 'Invalid signature',
  //     });
  //   }

  
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event !== "payment.captured"){
      return res.status(400).json({
      success: false,
      message: 'Invalid signature',
     });
    }

     const payment = event.payload.payment.entity


    const order = await Order.findOne({ razorpayOrderId: payment.order_id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }   

    order.razorpayPaymentId = payment.id;      
    order.status = 'Completed';
    await order.save();

    const user = await User.findById(order.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isPremiumMember = true;
    user.enrolledCourses.push(order.course);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      razorpay_order_id,
      razorpay_payment_id,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
}

export {createOrder , verifyPayment};