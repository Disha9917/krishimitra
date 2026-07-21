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
        <div className="relative flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <img src={preview} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-slate-200" />
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">{filename}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50/30">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600 mb-2">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-700">Click or drag image to upload</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Supports JPEG, PNG up to 10MB</p>
          <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
}