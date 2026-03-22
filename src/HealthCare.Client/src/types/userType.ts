export type userType = {
  // Personal
  firstNameAr: string;
  firstNameEn: string;
  lastNameAr: string;
  lastNameEn: string;
  birthDate: string;
  birthPlace: string;
  nationalId: string; // 16 digits mandatory for patients

  // Doctor-specific fields
  clinic?: string;
  department?: string;
  specialization?: string;

  // Family
  fatherId?: string;
  motherId?: string;
  maritalStatus?: "single" | "married" | "divorced";

  // Residence (dependent selects)
  wilaya?: string;
  dayra?: string;
  commune?: string;
  address?: string;

  // Medical / other
  bloodGroup?: string;
  gender?: "male" | "female";

  // Contact & auth
  phonePrimary?: string;
  phoneSecondary?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;

  // Role
  role?: "Patient" | "Doctor" | "Pharmacy" | "Admin";

  // file
  photo?: FileList | null;
};