import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (v) => /^\S+@\S+\.\S+$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
  },
  profileImage: String,
  lastLogin: Date,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  googleId: String, // New field for Google ID
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: String,
});

const User = mongoose.model("User", UserSchema);
export default User;
