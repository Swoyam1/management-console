import { OAuth2Client } from "google-auth-library"; // For verifying tokens
import User from "../models/User.js"; // Your User model
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload; // Extract user details

    // Check if the user already exists in your database
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId: sub,
        username: name,
        email: email,
      });
      await user.save();
    }

    // Generate JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    // Send the JWT token and user info back to the client
    res.json({ token, user });
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
