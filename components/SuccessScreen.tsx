
import React from 'react';
import { CheckCircleIcon, ArrowPathIcon } from './icons';

interface SuccessScreenProps {
  onStartOver: () => void;
}

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1OoznJi_Hrtw9uJkFWtTqo-QvSxgf8Y0MkJp4RqGS5Wg/edit?pli=1&gid=0#gid=0';

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onStartOver }) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center">
      <CheckCircleIcon className="w-20 h-20 text-[#23B794] mb-6" />

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your questionnaire is being processed</h2>
      <p className="text-gray-600 mb-6">You can review it at the following link:</p>
      
      <a
        href={GOOGLE_SHEET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8345BA] to-[#a365e0] text-white font-semibold rounded-2xl hover:opacity-90 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Open Questionnaire
      </a>
      
      <button
        onClick={onStartOver}
        className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
      >
        <ArrowPathIcon className="w-5 h-5" />
        Back
      </button>
    </div>
  );
};

export default SuccessScreen;
