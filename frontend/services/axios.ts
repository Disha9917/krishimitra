import { API_BASE_URL } from "../constants/api";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`Fetch fallback for ${endpoint}:`, error);
    throw error;
  }
}