export interface ISurvey {
  name: string;
  contact: string;
  address: string;
  preferredParty: string;
  aapCandidate: string;
  bjpCandidate: string;
  congressCandidate: string;
  otherPartyCandidate: string;
  customInputs?: {
    preferredParty?: string;
    aapCandidate?: string;
    bjpCandidate?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnalysis {
  totalResponses: number;
  demographics: {
    totalWithName: AnalysisCount;
    totalWithContact: AnalysisCount;
    totalWithAddress: AnalysisCount;
  };
  partyPreference: Record<string, AnalysisCount>;
  aapCandidates: Record<string, AnalysisCount>;
  bjpCandidates: Record<string, AnalysisCount>;
  congressCandidates: Record<string, AnalysisCount>;
  otherPartyCandidates: Record<string, AnalysisCount>;
}

interface AnalysisCount {
  count: number;
  percentage: string;
}
