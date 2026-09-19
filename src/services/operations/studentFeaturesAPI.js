import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Load Razorpay SDK
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")

    script.src = src

    script.onload = () => {
      resolve(true)
    }

    script.onerror = () => {
      resolve(false)
    }

    document.body.appendChild(script)
  })
}

// Buy Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")

  try {
    // Load Razorpay Checkout SDK
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    )

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      return
    }

    // Create Razorpay Order from Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log(
      "PAYMENT RESPONSE FROM BACKEND............",
      orderResponse.data
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }

    // Razorpay Checkout Options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,

      currency: orderResponse.data.data.currency,

      amount: orderResponse.data.data.amount,

      order_id: orderResponse.data.data.id,

      name: "StudyNotion",

      description: "Thank you for Purchasing the Course.",

      image: rzpLogo,

      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },

      handler: function (response) {
        console.log(
          "RAZORPAY PAYMENT SUCCESS RESPONSE............",
          response
        )

        sendPaymentSuccessEmail(
          response,
          orderResponse.data.data.amount,
          token
        )

        verifyPayment(
          {
            ...response,
            courses,
          },
          token,
          navigate,
          dispatch
        )
      },

      theme: {
        color: "#FFD60A",
      },
    }

    // Check frontend Razorpay key
    if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
      throw new Error(
        "REACT_APP_RAZORPAY_KEY is missing from frontend .env"
      )
    }

    // Open Razorpay Checkout
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()

    // Payment Failed
    paymentObject.on("payment.failed", function (response) {
      console.log(
        "RAZORPAY PAYMENT FAILED............",
        response.error
      )

      toast.error("Oops! Payment Failed.")
    })
  } catch (error) {
    console.log(
      "PAYMENT API ERROR............",
      error
    )

    console.log(
      "PAYMENT ERROR RESPONSE............",
      error?.response?.data
    )

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Could Not make Payment."
    )
  } finally {
    toast.dismiss(toastId)
  }
}

// Verify Payment
async function verifyPayment(
  bodyData,
  token,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Verifying Payment...")

  dispatch(setPaymentLoading(true))

  try {
    const response = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      bodyData,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log(
      "VERIFY PAYMENT RESPONSE FROM BACKEND............",
      response
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success(
      "Payment Successful. You are Added to the course."
    )

    dispatch(resetCart())

    navigate("/dashboard/enrolled-courses")
  } catch (error) {
    console.log(
      "PAYMENT VERIFY ERROR............",
      error
    )

    console.log(
      "VERIFY ERROR RESPONSE............",
      error?.response?.data
    )

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Could Not Verify Payment."
    )
  } finally {
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
  }
}

// Send Payment Success Email
async function sendPaymentSuccessEmail(
  response,
  amount,
  token
) {
  try {
    const emailResponse = await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log(
      "PAYMENT SUCCESS EMAIL RESPONSE............",
      emailResponse
    )
  } catch (error) {
    console.log(
      "PAYMENT SUCCESS EMAIL ERROR............",
      error
    )
  }
}