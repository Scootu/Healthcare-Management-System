import { type userType } from "../types/userType";
import { apiRequest } from "./apiClient";

export async function addDoctor(user: userType): Promise<{ nin: string }> {
  if (!user.email) throw new Error("Email is required");
  if (!user.password) throw new Error("Password is required");

  delete user.confirmPassword;

  // For doctors, generate a demo NIN accepted by the current auth system.
  const doctorNIN = `${Date.now()}`;

  // The backend exposes registration at POST /api/Auth/register and expects a smaller DTO.
  const registerPayload = {
    fNameLat: user.firstNameEn || "",
    lNameLat: user.lastNameEn || "",
    fNameAr: user.firstNameAr || "",
    lNameAr: user.lastNameAr || "",
    nationalite: "Algerian",
    phone: user.phonePrimary || "",
    nin: doctorNIN,
    email: user.email || "",
    password: user.password || "",
    role: "Doctor",
  };

  await apiRequest("/api/auth/register", { method: "POST", body: registerPayload });

  return { nin: doctorNIN };
}
