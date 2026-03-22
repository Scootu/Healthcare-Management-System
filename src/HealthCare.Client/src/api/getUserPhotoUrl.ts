import { baseUrl } from "./apiClient";

export function getUserPhotoUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return baseUrl + path;
}