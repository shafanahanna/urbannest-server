import User from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({
          status: "Forbidden",
          message: "User is blocked",
        });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      return res.status(200).json({ token, ...rest });
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashpassword = await bcrypt.hash(generatedPassword, 10);
    const phoneNumber = 8113834993;
    const newuser = new User({
      username: req.body.name,
      email: req.body.email,
      password: hashpassword,
      phoneNumber: phoneNumber,
      profile: req.body.photo,
    });
    await newuser.save();
    const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newuser._doc;
    res.status(200).json({ token, ...rest });
  } catch (error) {
    next(error);
  }
};
