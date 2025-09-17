import React from 'react';
import { ShieldCheckIcon, XMarkIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-[fade-in_0.2s_ease-out]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md p-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transform transition-all animate-[slide-up_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#8345BA]/30 sm:mx-0 sm:h-10 sm:w-10">
              <ShieldCheckIcon className="h-6 w-6 text-[#8345BA]" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-bold leading-6 text-white" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-white/70 whitespace-pre-wrap break-words">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-2xl border border-white/30 bg-white/10 px-4 py-2 text-base font-medium text-gray-200 shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-auto sm:text-sm transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-2xl border border-transparent bg-gradient-to-r from-[#8345BA] to-[#a365e0] px-4 py-2 text-base font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#8345BA] sm:w-auto sm:text-sm transition-all duration-300 ease-in-out hover:scale-105"
            onClick={onConfirm}
          >
            Confirm & Send
          </button>
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;