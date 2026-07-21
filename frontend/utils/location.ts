export function getCurrentGPSLocation(): Promise<{ lat: number; lng: number; formatted: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));
        resolve({
          lat,
          lng,
          formatted: `${lat}° N, ${lng}° E`,
        });
      },
      (error) => {
        // Fallback default coordinates (e.g. Ludhiana, Punjab / Nashik, Maharashtra)
        resolve({
          lat: 30.901,
          lng: 75.8573,
          formatted: "30.9010° N, 75.8573° E (Ludhiana, Punjab)",
        });
      },
      { timeout: 10000 }
    );
  });
}