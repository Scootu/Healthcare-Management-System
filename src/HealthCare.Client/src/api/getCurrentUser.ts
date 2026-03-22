import { apiRequest } from "./apiClient";

export type CurrentUser = {
  id: string;
  nin: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  role: string;
  speciality?: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await apiRequest("/api/auth/me", { method: "GET" });

  const payload = user as Record<string, unknown>;

  return {
    id: String(payload.id ?? ""),
    nin: String(payload.nin ?? ""),
    firstName: String(payload.firstName ?? ""),
    lastName: String(payload.lastName ?? ""),
    birthDate: String(payload.birthDate ?? ""),
    birthPlace: String(payload.birthPlace ?? ""),
    role: String(payload.role ?? ""),
    speciality: payload.speciality ? String(payload.speciality) : null,
  };
}
