
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, DocumentAnalysis } from './types';
import { analyzeDocument } from './services/geminiService';
import { WEBHOOK_URL } from './config/webhookConfig';

import Footer from './components/Footer';
import FileUploader from './components/FileUploader';
import ProcessingView from './components/ProcessingView';
import ReviewScreen from './components/ReviewScreen';
import SuccessScreen from './components/SuccessScreen';
import ErrorScreen from './components/ErrorScreen';
import { PaperAirplaneIcon } from './components/icons';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('IDLE');
    const [currentFiles, setCurrentFiles] = useState<File[]>([]);
    const [analysisResults, setAnalysisResults] = useState<DocumentAnalysis[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number } | null>(null);
    const [currentProcessingFile, setCurrentProcessingFile] = useState<string>('');
    const [webhookResponseData, setWebhookResponseData] = useState<any>(null);

    const reset = useCallback(() => {
        setAppState('IDLE');
        setCurrentFiles([]);
        setAnalysisResults([]);
        setErrorMessage(null);
        setProcessingProgress(null);
        setCurrentProcessingFile('');
        setWebhookResponseData(null);
    }, []);

    const handleFileSelect = useCallback((files: File[]) => {
        if (files.length > 0) {
            setCurrentFiles(files);
            setAppState('FILES_SELECTED');
        } else {
            setCurrentFiles([]);
            setAppState('IDLE');
        }
    }, []);
    
    const handleAnalyze = async () => {
        if (currentFiles.length === 0) return;

        setAppState('PROCESSING');
        const total = currentFiles.length;
        setProcessingProgress({ current: 1, total });
        
        const results: DocumentAnalysis[] = [];
        try {
            for (let i = 0; i < currentFiles.length; i++) {
                const file = currentFiles[i];
                setProcessingProgress({ current: i + 1, total });
                setCurrentProcessingFile(file.name);

                const base64Content = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = error => reject(error);
                });
                
                const analysis = await analyzeDocument(file, base64Content);
                results.push(analysis);
            }
            setAnalysisResults(results);
            setAppState('REVIEW');
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred during analysis.';
            setErrorMessage(msg);
            setAppState('ERROR');
        } finally {
            setProcessingProgress(null);
            setCurrentProcessingFile('');
        }
    };

    const handleSendToWebhook = async () => {
        setAppState('SENDING');
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(analysisResults),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Webhook responded with status ${response.status}: ${errorText}`);
            }

            // Check if response is JSON, otherwise ignore body
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const responseData = await response.json();
                setWebhookResponseData(responseData);
            }

            setAppState('SUCCESS');
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred while sending data.';
            setErrorMessage(msg);
            setAppState('ERROR');
        }
    };

    const mainContent = useMemo(() => {
        switch (appState) {
            case 'IDLE':
            case 'FILES_SELECTED':
                const isButtonDisabled = currentFiles.length === 0;
                return (
                    <>
                        <div className="text-left mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">AI Questionnaire Builder - ATLAN</h1>
                            <p className="text-gray-500 mt-2">Analyze your documents to get your ideal result</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                            <FileUploader onFileSelect={handleFileSelect} currentFiles={currentFiles} />
                            <div className="mt-8">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isButtonDisabled}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8345BA] to-[#a365e0] text-white font-semibold rounded-2xl hover:opacity-90 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    Analyze {currentFiles.length > 0 ? `${currentFiles.length} Document(s)` : ''}
                                </button>
                            </div>
                        </div>
                    </>
                );
            
            case 'PROCESSING':
                return <ProcessingView 
                    fileName={currentProcessingFile} 
                    progress={processingProgress ? `${processingProgress.current} of ${processingProgress.total}` : undefined} 
                />;

            case 'REVIEW':
            case 'SENDING': // Keep showing review screen with modal/loading state
                 return <ReviewScreen 
                    data={analysisResults}
                    onConfirm={handleSendToWebhook}
                    onCancel={reset}
                />;

            case 'SUCCESS':
                return <SuccessScreen onStartOver={reset} />;

            case 'ERROR':
                return <ErrorScreen message={errorMessage || 'An unknown error occurred.'} onRetry={reset} />;
            
            default:
                return null;
        }
    }, [appState, currentFiles, analysisResults, errorMessage, processingProgress, currentProcessingFile, reset]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 font-montserrat">
            <main className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-6 mb-8 transition-all duration-500 ease-in-out">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={appState}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {mainContent}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

export default App;
