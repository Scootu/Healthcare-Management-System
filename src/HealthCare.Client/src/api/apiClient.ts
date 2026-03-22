const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getToken() {
  return localStorage.getItem("api-auth-token") || null;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: RequestInit['body'] | Record<string, unknown>;
}

async function request(path: string, options: RequestOptions = {}) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(baseUrl + path, {
    ...options,
    headers,
    body: typeof options.body === 'object' && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body,
  } as RequestInit);

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error(`Backend endpoint not found (404). Requested ${baseUrl + path}. Check VITE_API_URL and WebApi routes.`);
    }
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

async function upload(path: string, formData: FormData) {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(baseUrl + path, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error(`Upload endpoint not found (404). Requested ${baseUrl + path}. Confirm backend upload route.`);
    }
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  return res.json();
}

export { baseUrl, request as apiRequest, upload as apiUpload };
