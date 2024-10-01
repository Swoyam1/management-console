import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // Sample data
  // const lastLoginTime = new Date().toLocaleString();
  const activities = [
    "Logged in from New York",
    "Joined a new group: Web Developers",
    "Commented on your friend's post",
    "Uploaded a new profile picture",
  ];
  const friends = [
    { name: "John Doe", status: "Online" },
    { name: "Jane Smith", status: "Offline" },
    { name: "Alice Johnson", status: "Online" },
    { name: "Bob Brown", status: "Offline" },
  ];
  const [lastLogin, setLastLogin] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check for the token in local storage
    const storedLastLogin = localStorage.getItem("lastLogin");
    if (storedLastLogin) {
      setLastLogin(new Date(storedLastLogin).toLocaleString()); // Convert to a readable format
    }

    if (token) {
      // If the token exists, navigate to the homepage
      navigate("/");
    } else {
      // If no token, navigate to the login page
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-white dark:text-black p-6">
      <div className="max-w-5xl mx-auto bg-gray-700 dark:bg-gray-200 text-white dark:text-black rounded-lg shadow-md">
        <div className="p-6 border-b dark:border-gray-600 border-white">
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="">Last login: {lastLogin}</p>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold">Activity Feed</h2>
          <ul className="mt-4 space-y-2">
            {activities.map((activity, index) => (
              <li
                key={index}
                className="p-2 dark:bg-gray-700 bg-gray-500 dark:text-white rounded-md shadow-sm"
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t dark:border-gray-600 border-white">
          <h2 className="text-xl font-semibold">Friends List</h2>
          <ul className="mt-4 space-y-2 ">
            {friends.map((friend, index) => (
              <li
                key={index}
                className="flex justify-between p-2 dark:bg-gray-700 bg-gray-500 dark:text-white  rounded-md shadow-sm"
              >
                <span>{friend.name}</span>
                <span
                  className={`text-sm ${
                    friend.status === "Online"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {friend.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
