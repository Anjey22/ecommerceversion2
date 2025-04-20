import axios from "axios";

const axiosInstance = axios.create({
    baseURL:import.meta.mode === "development" ? "http://localhost:5000/api": "api",
    withCredentials: true, //send cookies to the server
})

export default axiosInstance;

/*import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Backend URL
  withCredentials: true, // ✅ For sending cookies (e.g., JWT)
});

export default instance;*/
