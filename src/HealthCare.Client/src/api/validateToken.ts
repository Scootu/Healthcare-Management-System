import { apiRequest } from "./apiClient";

export const validateToken = async () => {
    const token = localStorage.getItem("api-auth-token");
    if (!token) return false;
    try {
        // call a backend endpoint that returns current user info
        const user = await apiRequest("/api/auth/me", { method: "GET" });
        return !!user;
    } catch {
        return false;
    }
};