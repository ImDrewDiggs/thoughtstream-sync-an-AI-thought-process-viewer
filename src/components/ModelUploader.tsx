
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { handleModelUpload, ModelInfo } from '@/utils/modelUtils';
import { cn } from '@/lib/utils';

interface ModelUploaderProps {
  onModelUploaded: (model: ModelInfo) => void;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({ onModelUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    const modelInfo = await handleModelUpload(file);
    setIsUploading(false);
    
    if (modelInfo) {
      onModelUploaded(modelInfo);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={cn(
        "glass-panel p-6 flex flex-col items-center justify-center w-full transition-all animate-appear",
        isDragging ? "border-blue-400 bg-blue-50/50" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept=".onnx,.tflite,.pt,.bin,.safetensors"
        onChange={handleFileSelect}
      />
      
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-blue-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium mb-2">Upload Your AI Model</h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        Drag and drop your model file here or click to browse
      </p>
      
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
          .onnx
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
          .tflite
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
          .pt
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
          .bin
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
          .safetensors
        </span>
      </div>
      
      <Button 
        onClick={triggerFileInput}
        disabled={isUploading}
        className="relative overflow-hidden transition-all duration-300"
      >
        {isUploading ? "Uploading..." : "Browse Files"}
        {isUploading && (
          <div className="absolute bottom-0 left-0 h-1 bg-blue-400 animate-pulse w-full" />
        )}
      </Button>
    </div>
  );
};

export default ModelUploader;
