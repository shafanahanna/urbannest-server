import jwt from "jsonwebtoken";
import { errorHandler } from "../Middleware/errorHandler.js";
import User from "../Models/userSchema.js";
import { joiPropertySchema } from "../Models/validationSchema.js";
import Property from "../Models/property.js";
import Order from "../Models/orderschema.js";

export const adminlogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: email },
        process.env.ADMIN_ACCESS_TOKEN_SECRET
      );
      return res.status(200).send({
        status: "Success",
        message: "Admin loginned sucessfully",
        data: token,
      });
    } else {
      return next(errorHandler(404, "admin not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const viewUser = async (req, res) => {
  const all_users = await User.find();
  const allusers = await User.countDocuments();

  if (all_users.length === 0) {
    return res
      .status(404)
      .json({ status: "error", message: "users not found." });
  } else {
    return res.status(200).json({
      status: "success",
      message: "Fetched users successsfully",
      data: all_users,
      datacount: allusers,
    });
  }
};

export const viewUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ status: "error", message: "user not found" });
  } else {
    return res
      .status(200)
      .json({ status: "success", message: "fetched user by id", data: user });
  }
};

export const addProperty = async (req, res, next) => {
  const { value, error } = await joiPropertySchema.validate(req.body);

  if (error) {
    return next(errorHandler(error.message));
  } else {
    const property_data = await Property.create({
      ...value,
    });

    return res.status(201).json({
      status: "success",
      message: "property added successfully ",
      data: property_data,
    });
  }
};

export const viewallproperty = async (req, res, next) => {
  try {
    const properties = await Property.find();
    const allproperty = await Property.countDocuments();

    if (properties) {
      res.status(200).json({
        status: "Success",
        message: "successfully package fetched",
        data: properties,
        datacount: allproperty,
      });
    } else {
      next(errorHandler(404, "package not found"));
    }
  } catch (err) {
    next(err);
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

export const updateproperties = async (req, res, next) => {
  try {
    const { value, error } = joiPropertySchema.validate(req.body);
    if (error) {
      next(errorHandler(400, error.message));
    }

    const { _id } = req.params;

    const updateProperty = await Property.findByIdAndUpdate(
      _id,
      { $set: { ...value } },
      { new: true }
    );

    if (updateproperties) {
      return res.status(200).json({
        status: "success",
        message: "Successfully updated data",
        data: updateProperty,
      });
    } else {
      return next(errorHandler(404, "Property not found"));
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const deletedProperty = await Property.findByIdAndDelete(_id);
    console.log(deletedProperty);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res
      .status(200)
      .json({ message: "Property deleted ", deletedProperty });
  } catch (err) {
    next(errorHandler);
  }
};

export const BlockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.query.action;

    const user = await User.findById(userId);
    console.log(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action === "block" && user.isBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    } else if (action === "unblock" && !user.isBlocked) {
      return res.status(400).json({ message: "User is already unblocked" });
    }

    user.isBlocked = action === "block";
    await user.save();

    const actionMessage = action === "block" ? "blocked" : "unblocked";
    res
      .status(200)
      .json({ message: `User ${actionMessage} successfully`, user });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user property");
    const allorders = await Order.countDocuments();

    if (orders.length === 0) {
      return next(errorHandler(404, "No bookings found"));
    }

    res.status(200).json({
      status: "success",
      message: "All bookings fetched successfully",
      data: orders,
      datacount: allorders,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(error.message));
  }
};
