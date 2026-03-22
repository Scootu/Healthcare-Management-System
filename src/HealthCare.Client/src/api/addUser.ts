import type { userType } from "../types/userType";
import { uploadUserPhoto } from "./uploadPhoto";
import { getUserPhotoUrl } from "./getUserPhotoUrl";
import { apiRequest } from "./apiClient";

function isFileList(x: unknown): x is FileList {
  return !!x && typeof (x as FileList).length === "number" && typeof (x as FileList).item === "function";
}

export async function addUser(user: userType) {
  if (user.photo) {
    // If user.photo is a FileList (e.g. from an <input type="file">), take the first file,
    // otherwise assume it's already a File.
    let file: File | null = null;

    if (isFileList(user.photo)) {
      file = (user.photo as FileList)[0] ?? null;
    } else {
      file = user.photo as File;
    }

    if (file) {
      const path = await uploadUserPhoto(file, user.nationalId.toString());
      getUserPhotoUrl(path);
    }
  }

  delete user.confirmPassword;

  // The backend exposes registration at POST /api/Auth/register and expects a smaller DTO.
  const registerPayload = {
    fNameLat: user.firstNameEn || "",
    lNameLat: user.lastNameEn || "",
    fNameAr: user.firstNameAr || "",
    lNameAr: user.lastNameAr || "",
    nationalite: "Algerian",
    phone: user.phonePrimary || "",
    nin: user.nationalId || "", // Required for patients
    email: user.email || "",
    password: user.password || "",
    role: user.role || "Patient",
  };

  // apiRequest will JSON.stringify the body for us, so we pass the plain object
  await apiRequest("/api/auth/register", { method: "POST", body: registerPayload as Record<string, unknown> });

  return true;
}