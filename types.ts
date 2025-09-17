export type AppState =
  | 'IDLE'
  | 'FILES_SELECTED'
  | 'PROCESSING'
  | 'REVIEW'
  | 'SENDING'
  | 'SUCCESS'
  | 'ERROR';

// Fix: Add and export the DocumentAnalysis interface.
export interface DocumentAnalysis {
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    company: string;
    contactPerson: string;
    documentDate: string;
  };
  executiveSummary: string;
  fullText: string;
  briefObjectives: string[];
  requirements: string[];
  scope: {
    inScope: string[];
    outOfScope: string[];
  };
  economicProposal: {
    costs: string[];
    timelines: string[];
    resources: string[];
  };
}