import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
export const getUsers = async (req, res) => {
  try {
    return res.status(200).json({
      message: "works fine!",
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(200).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req?.params?.id });

    if (!user) {
      return res.status(500).json({ message: "User Not Found!" });
    }
    const { password: pass, ...rest } = user._doc;

    return res.status(200).json({
      data: rest,
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(200).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const updateUser = async (req, res) => {
  const { username, email, password, avatar } = req.body;
  const userId = req?.userId;
  if (userId !== req?.params.id) {
    return res.status(500).json({ message: "UnAuthorized!" });
  }

  try {
    const user = await User.findOne({ _id: userId });
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: username ? username : user.username,
          email: email ? email : user.email,
          password: password ? hashedPassword : user.password,
          avatar: avatar ? avatar : user.avatar,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updateUser._doc;

    return res.status(200).json({
      message: "User Updated Successfully!",
      error: false,
      success: true,
      data: rest,
    });
  } catch (err) {
    return res.status(200).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req?.userId;
  if (userId !== req?.params.id) {
    return res.status(500).json({ message: "UnAuthorized!" });
  }

  try {
    await User.findByIdAndDelete(req?.params.id);

    return res.clearCookie("token").json({
      message: "User Deleted Successfully!",
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(200).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const Signout = async (req, res) => {
  try {
    return res.clearCookie("token").json({
      message: "User Signout Successfully!",
      error: false,
      success: true,
    });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};
