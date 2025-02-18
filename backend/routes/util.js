const multer = require("multer");
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

require("dotenv").config();

// Configure Multer for file uploads
// Dynamic folder storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = file.fieldname; // Dynamically get folder name from fieldname
    const uploadPath = path.join(__dirname, "static/uploads", folderName);

    // Ensure the folder exists, create it if not
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
});

const generatedOTP = {};
// initialize nodemailer
const mailConfig = {
  service: "gmail",
  auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(mailConfig);

const generateOTP = () => {
  const otp = Math.floor(Math.random() * 1000000);
  console.log(otp);
  return otp;
};

router.post("/sendotp", (req, res) => {
  const otp = generateOTP();
  generatedOTP[req.body.email] = otp;
  console.log(generatedOTP);
  transporter
      .sendMail({
          from: "mywebapp@gmail.com",
          to: req.body.email,
          subject: "OTP for Password Reset",
          html: `<p> OTP for password reset is <b>${otp}</b> </p>`,
      })
      .then((info) => {
          return res.status(201).json({
              msg: "OTP Sent",
              info: info.messageId,
              preview: nodemailer.getTestMessageUrl(info),
          });
      })
      .catch((err) => {
          console.log(err);
          return res.status(500).json({ msg: err });
      });
});

router.get("/verifyotp/:email/:otp", (req, res) => {
  const oldOTP = generatedOTP[req.params.email];
  console.log(oldOTP);
  console.log(req.params.otp);
  
  if (oldOTP == req.params.otp) {
      return res.status(200).json({ msg: "OTP Verified" });
  } else {
      return res.status(401).json({ msg: "OTP Not Verified" });
  }
});

module.exports = router;