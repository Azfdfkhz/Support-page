import { API_URL } from "./config";

export class ApiError extends Error {
  constructor(message, { status = 0, code = "" } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch(path, { method = "GET", json, formData, headers = {}, credentials, cache, timeoutMs = 15000 } = {}) {
  if (!API_URL) {
    throw new ApiError("API belum dikonfigurasi.", { code: "NOT_CONFIGURED" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const init = { method, headers: { Accept: "application/json", ...headers }, signal: controller.signal };
  if (credentials) init.credentials = credentials;
  if (cache) init.cache = cache;
  if (json !== undefined) {
    init.body = JSON.stringify(json);
    init.headers["Content-Type"] = "application/json";
  } else if (formData) {
    init.body = formData; 
  }

  try {
    let response;
    try {
      response = await fetch(`${API_URL}${path}`, init);
    } catch (error) {
      const timedOut = error?.name === "AbortError";
      throw new ApiError(timedOut ? "Permintaan terlalu lama." : "Tidak dapat terhubung ke server.", {
        code: timedOut ? "TIMEOUT" : "NETWORK",
      });
    }

    let data = null;
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      throw new ApiError(data?.message || `Permintaan gagal (${response.status}).`, {
        status: response.status,
        code: data?.code || "",
      });
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}
