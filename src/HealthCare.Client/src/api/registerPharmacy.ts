import { apiRequest } from "./apiClient";

interface PharmacyRegistrationData {
  pharmacyName: string;
  contactInfo: string;
  address: string;
  email: string;
  password: string;
}

export async function registerPharmacy(data: PharmacyRegistrationData) {
  if (!data.email) throw new Error("Email is required");
  if (!data.password) throw new Error("Password is required");

  // Pharmacy registration uses a different DTO - only business info
  const pharmacyPayload = {
    name: data.pharmacyName,
    contactPhone: data.contactInfo,
    address: data.address,
    email: data.email,
    password: data.password,
  };

  await apiRequest("/api/pharmacies/register", {
    method: "POST",
    body: pharmacyPayload as Record<string, unknown>,
  });

  return true;
}
