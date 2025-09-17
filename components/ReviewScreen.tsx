
import React, { useState } from 'react';
import { DocumentAnalysis } from '../types';
import { CheckCircleIcon, DocumentDuplicateIcon, ChevronDownIcon, PaperAirplaneIcon, XMarkIcon } from './icons';

interface ReviewScreenProps {
  data: DocumentAnalysis[];
  onConfirm: () => void;
  onCancel: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-gray-50 p-4 rounded-xl border border-gray-200 ${className}`}>
        <h3 className="text-sm font-semibold text-[#8345BA] mb-2">{title}</h3>
        <div className="text-sm text-gray-700 space-y-1">{children}</div>
    </div>
);

const ListItems: React.FC<{ items: string[] | undefined }> = ({ items }) => {
    if (!items || items.length === 0) return <p className="text-gray-400 italic">None specified.</p>;
    return (
        <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    );
}

const DocumentReview: React.FC<{ analysis: DocumentAnalysis }> = ({ analysis }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            {/* Left Panel: Full Text */}
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Extracted Text</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto max-h-96 flex-grow">
                    <p className="text-gray-600 text-sm whitespace-pre-wrap font-mono">
                        {analysis.fullText || "No text could be extracted from the document."}
                    </p>
                </div>
            </div>

            {/* Right Panel: Structured Data */}
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Analysis</h3>
                <div className="space-y-4 overflow-y-auto pr-2 max-h-96">
                    <InfoCard title="Executive Summary">
                        <p>{analysis.executiveSummary}</p>
                    </InfoCard>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InfoCard title="Company">{analysis.metadata.company}</InfoCard>
                        <InfoCard title="Contact">{analysis.metadata.contactPerson}</InfoCard>
                        <InfoCard title="Date">{analysis.metadata.documentDate}</InfoCard>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard title="Objectives"><ListItems items={analysis.briefObjectives} /></InfoCard>
                        <InfoCard title="Requirements"><ListItems items={analysis.requirements} /></InfoCard>
                    </div>

                    <InfoCard title="Scope">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">In Scope</h4>
                                <ListItems items={analysis.scope?.inScope} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Out of Scope</h4>
                                <ListItems items={analysis.scope?.outOfScope} />
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Economic Proposal">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div><h4 className="font-semibold text-gray-800 mb-1">Costs</h4><ListItems items={analysis.economicProposal?.costs} /></div>
                            <div><h4 className="font-semibold text-gray-800 mb-1">Timelines</h4><ListItems items={analysis.economicProposal?.timelines} /></div>
                            <div><h4 className="font-semibold text-gray-800 mb-1">Resources</h4><ListItems items={analysis.economicProposal?.resources} /></div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};


const ReviewScreen: React.FC<ReviewScreenProps> = ({ data, onConfirm, onCancel }) => {
  const [copied, setCopied] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Review</h2>
          <p className="text-gray-600">Review the extracted data for each document below before sending.</p>
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center mt-2 sm:mt-0 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 transition-all duration-300"
        >
          {copied ? <CheckCircleIcon className="w-4 h-4 mr-2 text-[#23B794]"/> : <DocumentDuplicateIcon className="w-4 h-4 mr-2"/>}
          {copied ? 'Copied!' : 'Copy All JSON'}
        </button>
      </div>

      <div className="space-y-2 max-h-[calc(65vh-80px)] overflow-y-auto pr-2 pb-4">
        {data.map((analysis, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
            >
              <span className="font-semibold text-gray-800">{analysis.metadata.fileName}</span>
              <ChevronDownIcon className={`w-5 h-5 text-gray-500 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === index && (
              <div className="p-4 bg-white">
                <DocumentReview analysis={analysis} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={onCancel}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
          >
            <XMarkIcon className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8345BA] to-[#a365e0] text-white font-semibold rounded-2xl hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-105"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            {`Confirm & Send ${data.length} Summar${data.length > 1 ? 'ies' : 'y'}`}
          </button>
        </div>
    </div>
  );
};

export default ReviewScreen;
