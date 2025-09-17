import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from './icons';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center">
      <ExclamationTriangleIcon className="w-16 h-16 text-[#FF9500] mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">An Error Occurred</h2>
      <p className="text-yellow-800 bg-[#FF9500]/20 p-3 rounded-md mb-6 font-medium">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
      >
        <ArrowPathIcon className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorScreen;