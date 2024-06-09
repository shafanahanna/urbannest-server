import express from "express";
import { sendOTP, verifyOtp } from "../Controllers/otp_verification.js";
import {
  Payment,
  Signin,
  propertybyid,
  searchProperty,
  viewallproperties,
  deleteaccount,
  createorder,
  getorders,
  updateUser,
} from "../Controllers/userController.js";
import { Signup } from "../Controllers/userController.js";
import { verifyToken } from "../Middleware/userauth.js";
import { sendEmail } from "../nodemailer/nodemaileruser.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/send-otp", sendOTP);
router.get("/properties", viewallproperties);
router.get("/search", searchProperty);

router.post("/verifyotp", verifyOtp);
router.use(verifyToken);
router.put("/:_id", updateUser);
router.delete("/:id", deleteaccount);

router.get("/properties/:id", propertybyid);
router.post("/payment", Payment);
router.post("/order", createorder);
router.get("/order/:id", getorders);
router.post("/sendmail", sendEmail);

export default router;
