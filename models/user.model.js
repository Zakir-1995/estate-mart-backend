import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg",
    },
    isAdmin: {
      type:Boolean,default:false
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
