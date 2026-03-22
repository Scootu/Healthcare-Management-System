import { apiUpload } from "./apiClient";

export async function uploadUserPhoto(file: File, userId: string) {
  const form = new FormData();
  form.append("file", file);

  const res = await apiUpload(`/users/${encodeURIComponent(userId)}/photo`, form);

  // Expect backend to return an object with `url` or `path`
  return res?.url || res?.path || res?.fileUrl || "";
}