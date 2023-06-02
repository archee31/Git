const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const studentcontroller = require("../src/students/studentcontroller");
const Student = require("../src/students/studentmodel");

// Function to generate a numeric OTP
function generateNumericOTP(length) {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
router.route("/student/login").post(studentcontroller.loginUserControllerFn);
router
  .route("/student/create")
  .post(studentcontroller.createstudentControllerFn);
// Forgot password API
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Generate 6-digit numeric OTP
    const otp = generateNumericOTP(4);

    // Set OTP and expiration time
    student.resetOtp = otp;
    student.resetOtpExpiration = Date.now() + 3600000; 
    await student.save();

   
    let mailTransporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user:"doshiarchee.19.ce@iite.indusuni.ac.in",
        pass:"Archee@26_00",
      },
    });

    const mailOptions = {
      from:"doshiarchee.19.ce@iite.indusuni.ac.in",
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP to reset the password is: ${otp}
             please donot share this otp with anyone`,
    };

    try {
      await mailTransporter.sendMail(mailOptions);
      console.log("Email is sent successfully.");
    } catch (error) {
      console.log("Error occurred while sending email:", error);
    }

    res.json({ message: "Reset email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// ...

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
console.log("messageeeeee",req.body.email);
  try {
    const student = await Student.findOne({
      email,
      resetOtp: otp,
      resetOtpExpiration: { $gt: Date.now() },
    });
console.log(email);
    if (!student) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
      
    }

    student.resetOtp = undefined;
    student.resetOtpExpiration = undefined;
    await student.save();

    res.json({ message: "OTP verification successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset password API
router.post("/reset-password", async (req, res) => {
  const { email, otp, password } = req.body;
  

  try {
    const student = await Student.findOne({
      email,
      resetOtp: otp,
      resetOtpExpiration: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update the student's password
    student.password = password;
    student.resetOtp = undefined;
    student.resetOtpExpiration = undefined;
    await student.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/change-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
console.log('messgae',req.body.email)
  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Update the student's password
    student.password = newPassword;
    await student.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
