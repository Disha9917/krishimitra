export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeMB = 10;

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please upload a JPEG, PNG, or WEBP image." };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Image size must be less than ${maxSizeMB}MB.` };
  }

  return { valid: true };
}