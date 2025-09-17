import React, { useState, useEffect } from 'react';
import { CogIcon } from './icons';

const processingSteps = [
  "Initializing analysis engine...",
  "Extracting text content...",
  "Identifying document structure...",
  "Applying semantic analysis...",
  "Generating executive summary...",
  "Finalizing JSON output..."
];

interface ProcessingViewProps {
  fileName: string;
  progress?: string;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ fileName, progress }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % processingSteps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
      <CogIcon className="w-16 h-16 text-[#23B794] animate-spin mb-6" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {progress ? `Analyzing Document (${progress})` : 'Analyzing Document'}
      </h2>
      <p className="text-gray-600 truncate w-full max-w-md mb-6">{fileName}</p>
      
      <div className="relative h-6 w-full max-w-xs overflow-hidden">
        {processingSteps.map((step, index) => (
          <p
            key={step}
            className={`absolute w-full transition-all duration-500 ease-in-out text-gray-700 ${index === currentStep ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
          >
            {step}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProcessingView;