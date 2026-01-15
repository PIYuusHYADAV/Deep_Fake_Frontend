"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
}

export function ImageUpload({ onImageSelect, isLoading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
      onImageSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-all cursor-pointer duration-300 ${
            isDragActive
              ? "border-primary bg-primary/10 scale-105"
              : "border-border/60 hover:border-primary/60 hover:bg-primary/5"
          }`}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div
              className={`p-3 rounded-lg transition-all duration-300 ${
                isDragActive
                  ? "bg-primary/30 scale-110"
                  : "bg-primary/10 group-hover:bg-primary/20"
              }`}
            >
              <Upload
                className={`w-6 h-6 text-primary transition-transform ${
                  isDragActive ? "scale-110" : ""
                }`}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragActive ? "Drop to upload" : "Drag and drop an image"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <div className="relative rounded-lg overflow-hidden border border-primary/30 bg-card shadow-lg">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-auto object-cover max-h-80"
            />
            <button
              onClick={clearImage}
              disabled={isLoading}
              className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-lg hover:bg-background transition-colors disabled:opacity-50 border border-border/50"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 p-1.5 bg-gradient-to-r from-success to-success/80 rounded-lg shadow-lg animate-glow">
              <Check className="w-4 h-4 text-foreground font-bold" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate">{fileName}</p>
            <Button
              onClick={handleClick}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="rounded-lg bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors"
            >
              Change
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
