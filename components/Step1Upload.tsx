
import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';

interface Step1UploadProps {
  onImageVerified: (file: File, base64: string) => void;
  verifyIsPersonalPhoto: (base64: string) => Promise<boolean>;
}

const Step1Upload: React.FC<Step1UploadProps> = ({ onImageVerified, verifyIsPersonalPhoto }) => {
  const [image, setImage] = useState<{ file: File, preview: string, base64: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file (PNG, JPG, etc.).");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage({
          file: file,
          preview: URL.createObjectURL(file),
          base64: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!image) return;
    setIsVerifying(true);
    setError(null);
    try {
      const isPersonal = await verifyIsPersonalPhoto(image.base64);
      if (isPersonal) {
        onImageVerified(image.file, image.base64);
      } else {
        setError("This doesn't seem to be a personal photo. Please upload a picture of a person (e.g., a selfie or portrait).");
        setImage(null);
      }
    } catch (e) {
      setError("Verification failed. Please check your connection and try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }


  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <h2 className="text-3xl font-orbitron text-cyan-400 mb-2">Step 1: Upload Your Portrait</h2>
      <p className="text-gray-400 mb-8">Select or drag & drop a personal photo to begin the transformation.</p>

      {!image && (
        <label 
          className={`relative block w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-gray-800' : 'border-gray-600 hover:border-purple-500'}`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
            <span className="text-lg font-semibold text-gray-300">Drag & Drop or Click to Upload</span>
            <span className="text-sm text-gray-500">PNG, JPG, WEBP supported</span>
          </div>
          <input type="file" accept="image/*" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={(e) => handleFileChange(e.target.files)} />
        </label>
      )}

      {image && (
        <div className="mt-8 flex flex-col items-center">
          <div className="relative border-2 border-purple-500 rounded-lg p-2 shadow-lg shadow-purple-500/20">
            <img src={image.preview} alt="Preview" className="max-h-80 rounded-md object-contain" />
          </div>
          <div className="flex space-x-4 mt-6">
            <button 
                onClick={() => setImage(null)} 
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
            >
              Choose a different photo
            </button>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-6 py-3 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center w-48"
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify & Proceed'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md animate-fade-in-up">
          <p className="font-bold">Verification Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Step1Upload;
