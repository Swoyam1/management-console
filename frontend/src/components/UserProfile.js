import React, { useEffect, useState } from "react";
import axios from "../services/api"; // Your axios instance for API calls

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const fetchUserProfile = async () => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem("token");

      const response = await axios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      }); // Make GET request to fetch user profile
      const userData = response.data.user;

      // Set the user data in the component state
      setName(userData.username);
      setEmail(userData.email);
      setProfileImage(userData.profileImage); // Assuming this is the URL of the image
      setImagePreview(userData.profileImage); // For image preview
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load user profile. Please try again.");
    }
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Imagechanged!");
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the uploaded image
    }
  };

  const handleProfileUpdate = async () => {
    // Create an object with the updated user data
    // const updatedUserData = {
    //   username: name,
    //   email: email,
    //   profileImage: imagePreview,
    // };
    let formData = new FormData();
    formData.append("username", name); // Add name to the form data
    formData.append("email", email); // Add email to the form data

    if (profileImage) {
      formData.append("profileImage", profileImage); // Append the image if it's selected
    }

    try {
      // Get the token from local storage for saving user data
      const token = localStorage.getItem("token");

      // Send the updated user data to the backend
      const response = await axios.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

      // await fetchUserProfile();
      console.log("Profile updated successfully!");
      alert("Profile updated successfully!"); // Optionally show a success message
    } catch (error) {
      console.error("Error saving user profile:", error);
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          User Profile
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300 mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder={name}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder={email}
            disabled
          />
        </div>

        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          onClick={handleProfileUpdate} // Replace with save functionality
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
