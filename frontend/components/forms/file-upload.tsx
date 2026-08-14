import * as React from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { fileToDataURL } from "../../utils/image";

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({ onFileSelect, accept = "image/*" }: FileUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [filename, setFilename] = React.useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const url = await fileToDataURL(file);
      setPreview(url);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFilename(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative flex items-center justify-between rounded-xl border border-slate-200 dark:border-[#2A2F3A] bg-slate-50 dark:bg-[#111827] p-3">
          <div className="flex items-center gap-3">
            <img src={preview} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-[#2A2F3A]" />
            <span className="text-xs font-semibold text-slate-800 dark:text-[#C9D1D9] truncate max-w-[200px]">{filename}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1C212A] hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#2A2F3A] bg-slate-50/50 dark:bg-[#111827]/50 p-6 text-center transition-colors hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-[#1C212A]">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-3 text-emerald-600 dark:text-emerald-400 mb-2">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-[#C9D1D9]">Click or drag image to upload</p>
          <p className="text-[11px] text-slate-400 dark:text-[#8B949E] mt-0.5">Supports JPEG, PNG up to 10MB</p>
          <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
}