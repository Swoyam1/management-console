import User from "../models/User.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getUserProfile = async (req, res) => {
  console.log("Req User ID", req.user.id);
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      console.log("No User !");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log("User Found !", user);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.id;
    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("Request", req.body);

    // Check if a new profile image is being uploaded
    if (req.file) {
      console.log("Request File", req.file);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics",
      });
      updates.profileImage = result.secure_url; // Store the URL from Cloudinary
      console.log("Image", result.secure_url);
    }

    console.log("Updates", updates);
    console.log("Profile Image", updates.profileImage);

    // Update user details
    user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const enableTwoFactorAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a new 2FA secret
    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Create a QR code for 2FA setup
    const dataUrl = await QRCode.toDataURL(secret.otpauth_url);

    return res.status(200).json({ success: true, dataUrl });
  } catch (error) {
    console.error("Enable 2FA Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyTwoFactorAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "2FA enabled successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Verify 2FA Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
