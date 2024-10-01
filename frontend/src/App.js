import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { useEffect } from "react";
import UserProfile from "./components/UserProfile";
import { isAuthenticated } from "./utils/auth";
import { ThemeProvider } from "./components/context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Main />
      </Router>
    </ThemeProvider>
  );
}

//const token = localStorage.getItem("token"); // Check for the token in local storage
function Main() {
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/login"); // Navigate to the login page after logout
  };

  return (
    <div className="max-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      {isAuthenticated() && (
        <div className="flex w-full px-4 py-3 justify-between">
          <div className="flex space-x-4 font-bold text-lg">
            <div
              onClick={() => handleNavigation("/")}
              className="cursor-pointer dark:bg-blue-500  bg-blue-400  hover:bg-blue-300 dark:hover:bg-blue-400 p-2 rounded transition"
            >
              <span>Home</span>
            </div>
            <div
              onClick={() => handleNavigation("/profile")}
              className="cursor-pointer dark:bg-blue-500 bg-blue-400  hover:bg-blue-300 dark:hover:bg-blue-400 p-2 rounded transition"
            >
              <span>Profile</span>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="rounded-md dark:bg-white bg-gray-300 hover:bg-gray-400 text-red-600 text-md font-bold px-2 py-1"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default App;
