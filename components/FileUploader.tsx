
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadIcon, DocumentIcon, TrashIcon } from './icons';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  currentFiles: File[];
}

const ACCEPTED_FILES = 'application/pdf';

const dropzoneVariants = {
  initial: { backgroundColor: 'transparent', borderColor: '#d1d5db' },
  hover: { borderColor: '#8345BA', backgroundColor: 'rgba(131, 69, 186, 0.05)' },
  dragging: { borderColor: '#23B794', backgroundColor: 'rgba(35, 183, 148, 0.05)' },
};

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, currentFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentFiles.length === 0) {
      setError(null);
    }
  }, [currentFiles]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = useCallback((selectedFiles: FileList | null) => {
    setError(null);
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = Array.from(selectedFiles);
    const invalidFiles = newFiles.filter(file => file.type !== 'application/pdf');

    if (invalidFiles.length > 0) {
      setError(`Invalid file type detected. Please upload PDF files only.`);
      onFileSelect([]);
      return;
    }
    
    onFileSelect(newFiles);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = ''; // Reset for re-upload
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    onFileSelect(currentFiles.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="w-full">
      {currentFiles.length === 0 ? (
        <>
            <motion.div
                className="w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                initial="initial"
                whileHover="hover"
                animate={isDragging ? 'dragging' : 'initial'}
                variants={dropzoneVariants}
                transition={{ duration: 0.2 }}
            >
                <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} accept={ACCEPTED_FILES} multiple />
                <UploadIcon className="w-10 h-10 text-gray-400 mb-3" />
                <p className="font-semibold text-gray-700 text-center px-4">Select your Economic Proposal and Project Brief or drag and drop here</p>
                <p className="text-sm text-gray-500 mt-1">(only PDF, up to 10MB)</p>
            </motion.div>
            {error && <p className="text-sm text-center text-red-600 mt-3 font-medium">{error}</p>}
        </>
      ) : (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
            {currentFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-gray-100 p-3 rounded-lg border border-gray-200 animate-[fade-in_0.3s_ease-out]">
                    <DocumentIcon className="w-8 h-8 text-[#8345BA] mr-3 flex-shrink-0" />
                    <div className="text-left overflow-hidden flex-grow">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => handleRemoveFile(index)} className="ml-3 p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
             <style>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(-5px); }
                  to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
