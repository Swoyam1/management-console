import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// const api = axios.create({
//   baseURL: "https://management-console-backend.onrender.com",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export default api;
