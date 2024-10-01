import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { GitHubLogin } from "@react-oauth/github";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/auth/login", { email, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        // Store the current timestamp as the last login time
        const lastLoginTime = new Date().toISOString(); // ISO format
        localStorage.setItem("lastLogin", lastLoginTime);
        navigate("/");
      }
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // console.log("Google Login Successful:", credentialResponse);

      // Extract the ID token from the credential response
      const idToken = credentialResponse.credential;

      // Make an API call to your backend for verification and login
      const response = await axios.post("/auth/google", { idToken });

      // Assuming your backend responds with a JWT token
      const { token } = response.data;

      // Store the token in local storage
      localStorage.setItem("token", token);

      // Store the current timestamp as the last login time
      const lastLoginTime = new Date().toISOString(); // ISO format
      localStorage.setItem("lastLogin", lastLoginTime);
      console.log("Login successful: Google Auth!");

      // Navigate to the dashboard
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-gray-500">Or login with</p>
          <div className="flex justify-center space-x-4 mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
            />
            {/* <GitHubLogin
              onSuccess={handleGitHubSuccess}
              onError={handleGitHubFailure}
            /> */}
          </div>
        </div>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
