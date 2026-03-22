import { apiRequest } from "./apiClient";

type LoginResponse = {
  accessToken?: string;
  token?: string;
  access_token?: string;
  role?: string;
};

function getPostLoginPath(role?: string) {
  switch ((role || "").toLowerCase()) {
    case "doctor":
      return "/doctors";
    case "pharmacy":
      return "/pharmacy";
    default:
      return "/dashboard";
  }
}

export const handleLogin = async ({ nin, password }: { nin: string; password: string }) => {
  const res = (await apiRequest("/api/auth/login", {
    method: "POST",
    body: { NIN: nin.trim(), password } as Record<string, unknown>,
  })) as LoginResponse;

  const token = res?.accessToken || res?.token || res?.access_token;
  if (!token) throw new Error("No token returned from auth");

  localStorage.setItem("api-auth-token", token);

  if (res.role) {
    localStorage.setItem("api-auth-role", res.role);
  }

  window.location.href = getPostLoginPath(res.role);
};