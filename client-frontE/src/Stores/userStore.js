import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Use configured axios instance
import { toast } from "react-hot-toast";

export const userStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async (name, email, password, confirmPassword) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Password does not match");
        }

        try {
            const res = await axiosInstance.post("/auth/signup", { name, email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    login: async (email, password) => {
        set({ loading: true });

        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            console.log("🔍 Checking authentication...");
            const response = await axiosInstance.get("/auth/profile");
            console.log("✅ Authenticated User:", response.data);
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            console.error("❌ Authentication check failed:", error.response?.data || error.message);
            set({ checkingAuth: false, user: null });
        }
    },

    refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axiosInstance.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    },
}));

// Export function for direct use
export const checkAuth = async () => {
    try {
        console.log("🔍 Sending auth check request...");
        const response = await axiosInstance.get("/auth/profile");
        console.log("✅ Authenticated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Authentication check failed:", error.response?.data || error.message);
        return null;
    }
};

// Axios interceptor for token refresh
let refreshPromise = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (refreshPromise) {
                    await refreshPromise;
                    return axiosInstance(originalRequest);
                }

                refreshPromise = userStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                userStore.getState().logout(); // fixed from `useUserStore`
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
