import User from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../Controllers/otp_verification.js";
import { joiUserSchema } from "../Models/validationSchema.js";
import { errorHandler } from "../Middleware/errorHandler.js";
import Property from "../Models/property.js";
import Razorpay from "razorpay";
import orders from "../Models/orderschema.js";
import { sendEmailToUser } from "../nodemailer/nodemailer.js";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const serviceId = process.env.TWILIO_SERVICEID;

const client = twilio(accountSid, authToken);

export const Signup = async (req, res, next) => {
  try {
    const { value, error } = joiUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { username, email, phoneNumber, password } = value;

    const existinguser = await User.findOne({ username: username });
    if (existinguser) {
      res.status(400).json({
        status: "error",
        message: "username already exist",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: hashedpassword,
    });
    await newUser.save();

    newUser.otpStatus = "sent";
    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "user registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "an unexpected error occured",
    });
  }
};

export const completeRegister = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    user.otpStatus = "verified";
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "registration completed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};

export const Signin = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { email, password } = value;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    if (validUser.isBlocked) {
      return res
        .status(403)
        .json({ status: "false", message: "user is blocked" });
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Incorrect password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
        phoneNumber: validUser.phoneNumber,
        profile: validUser.profile,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req, res) => {
  const { _id } = req.params;
  const { username, email, password, phoneNumber, profile } = req.body;

  try {
    const updatedData = { username, email, phoneNumber, profile };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteaccount = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only delete your own account"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted");
  } catch (error) {
    next(error);
  }
};

export const viewallproperties = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = category ? { category } : {};

    const products = await Property.find(query);

    if (!products || products.length === 0) {
      return next(
        errorHandler(404, "Properties not found for the specified category")
      );
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully fetched products",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const propertybyid = async (req, res, next) => {
  const propertyId = req.params.id;
  try {
    const property = await Property.findById(propertyId);
    if (property) {
      return res.status(200).json({
        status: "success",
        message: "Property fetched successfully",
        data: property,
      });
    } else {
      return next(errorHandler(404, "Property not found"));
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    return next(error);
  }
};
export const searchProperty = async (req, res, next) => {
  try {
    const { place, category } = req.query;

    let query = {};

    if (place) {
      query.place = { $regex: new RegExp(place, "i") };
    }
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    const property = await Property.find(query);

    if (property.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No packages found for the specified criteria",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Fetched packages available for the specified criteria",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const Payment = async (req, res, next) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const { amount, currency, receipt } = req.body;

  try {
    const payment = await razorpay.orders.create({ amount, currency, receipt });
    await sendEmailToUser(
      "shafanahanna1999@gmail.com",
      amount,
      currency,
      receipt
    );
    res.json({
      status: "success",
      message: "payment initiated",
      data: payment,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(error.message));
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
export const createorder = async (req, res, next) => {
  const { userId, PropertyId, amount, currency } = req.body;

  try {
    const payment = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    const order = new orders({
      user: userId,
      property: PropertyId,
      paymentId: payment.id,
      total_amount: amount,
    });

    await order.save();

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
      payment_id: payment.id,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(error.message));
  }
};

export const getorders = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await orders
      .findById(id)
      .populate("user")
      .populate("property");

    if (!order) {
      return next(errorHandler(404, "order not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(error.message));
  }
};
