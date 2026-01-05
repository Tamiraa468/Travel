"use client";

import React, { useState } from "react";

type ImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  accept?: string;
};

export default function ImageUpload({
  label,
  value,
  onChange,
  required = false,
  accept = "image/*",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string>(value);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.ok) {
        setError(result.error || "Upload failed");
        return;
      }

      // Set the uploaded image URL
      setPreview(result.url);
      onChange(result.url);
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    onChange(url);
    setPreview(url);
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Preview */}
      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* File Upload */}
      <div className="mb-3">
        <label className="flex items-center gap-2 px-4 py-2 bg-forest-700 text-white rounded-lg cursor-pointer hover:bg-forest-900 transition w-fit">
          <span>{uploading ? "Uploading..." : "📁 Choose Image"}</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}
      </div>

      {/* Or use URL */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-2">Or paste image URL:</p>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={handleUrlChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
