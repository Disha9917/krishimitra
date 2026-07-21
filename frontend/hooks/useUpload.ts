import { useState } from "react";
import { validateImageFile, fileToDataURL } from "../utils/image";

export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (selectedFile: File) => {
    setError(null);
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }
    setFile(selectedFile);
    const url = await fileToDataURL(selectedFile);
    setPreviewUrl(url);
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  return { file, previewUrl, error, handleFileChange, clear };
}