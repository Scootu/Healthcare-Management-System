import { apiRequest } from "./apiClient";

export interface PrescriptionItem {
  type: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface OutOfStockItem {
  medicineName: string;
  requiredQuantity: number;
  availableQuantity: number;
  shortage: number;
}

export interface PrescriptionValidation {
  prescriptionId: number;
  patientNHCN: string;
  patientName: string;
  doctorName: string;
  dateIssued: string;
  items: PrescriptionItem[];
  allItemsInStock: boolean;
  outOfStockItems: OutOfStockItem[];
  validationStatus: "Valid" | "PartiallyAvailable" | "Unavailable";
}

export interface StockItem {
  stockId: number;
  medicineId: number;
  medicineName: string;
  concentration: string;
  form: string;
  quantity: number;
  pharmacyId: number;
  pharmacyName: string;
  expiryDate: string;
  isLowStock: boolean;
  isExpired: boolean;
}

/**
 * Get prescriptions for a patient by NHCN
 */
export async function getPrescriptionsByNHCN(
  nhcn: string,
  pharmacyId?: number
): Promise<PrescriptionValidation[]> {
  const url = pharmacyId
    ? `/api/pharmacies/prescriptions/nhcn/${nhcn}?pharmacyId=${pharmacyId}`
    : `/api/pharmacies/prescriptions/nhcn/${nhcn}`;

  const response = await apiRequest(url, {
    method: "GET",
  });

  return response.data || [];
}

/**
 * Validate a prescription for dispensing
 */
export async function validatePrescription(
  prescriptionId: number,
  pharmacyId: number
): Promise<PrescriptionValidation | null> {
  try {
    const response = await apiRequest(
      `/api/pharmacies/prescriptions/${prescriptionId}/validate?pharmacyId=${pharmacyId}`,
      {
        method: "GET",
      }
    );

    return response.data || null;
  } catch (error) {
    console.error("Error validating prescription:", error);
    return null;
  }
}

/**
 * Get all stock for a pharmacy
 */
export async function getPharmacyStock(pharmacyId: number): Promise<StockItem[]> {
  try {
    const response = await apiRequest(`/api/pharmacies/${pharmacyId}/stock`, {
      method: "GET",
    });

    return response.data || [];
  } catch (error) {
    console.error("Error fetching pharmacy stock:", error);
    return [];
  }
}

/**
 * Update stock quantity
 */
export async function updateStock(
  medicineId: number,
  pharmacyId: number,
  quantity: number,
  reason?: string
): Promise<StockItem | null> {
  try {
    const response = await apiRequest("/api/pharmacies/stock", {
      method: "PUT",
      body: JSON.stringify({
        medicineId,
        pharmacyId,
        quantity,
        reason,
      }),
    });

    return response.data || null;
  } catch (error) {
    console.error("Error updating stock:", error);
    return null;
  }
}

/**
 * Get low stock items
 */
export async function getLowStockItems(pharmacyId: number): Promise<StockItem[]> {
  try {
    const response = await apiRequest(`/api/pharmacies/${pharmacyId}/stock/low`, {
      method: "GET",
    });

    return response.data || [];
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return [];
  }
}

/**
 * Get expired medicines
 */
export async function getExpiredMedicines(pharmacyId: number): Promise<StockItem[]> {
  try {
    const response = await apiRequest(`/api/pharmacies/${pharmacyId}/stock/expired`, {
      method: "GET",
    });

    return response.data || [];
  } catch (error) {
    console.error("Error fetching expired medicines:", error);
    return [];
  }
}

/**
 * Mark prescription as dispensed
 */
export async function markPrescriptionAsDispensed(
  prescriptionId: number
): Promise<boolean> {
  try {
    await apiRequest(`/api/pharmacies/prescriptions/${prescriptionId}/dispense`, {
      method: "POST",
    });

    return true;
  } catch (error) {
    console.error("Error marking prescription as dispensed:", error);
    return false;
  }
}
