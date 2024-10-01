import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://management-console-frontend.onrender.com"], // Allow requests from your frontend server
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiter to all requests
app.use(limiter);

// Error handling middleware for rate limiting
app.use((err, req, res, next) => {
  if (err instanceof rateLimit.RateLimit) {
    return res.status(429).json({ error: err.message });
  }
  next(err); // Pass the error to the next middleware
});

//Routes
// Set up a basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
