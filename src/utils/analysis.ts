// utils/analysis.ts
import type { IAnalysis } from "../types/survey";
import type { ISurveyDocument } from "../models/survey";

export const calculatePercentage = (value: number, total: number): string => {
  if (total === 0) return "0";
  return ((value / total) * 100).toFixed(2);
};

export const generateAnalysis = (surveys: ISurveyDocument[]): IAnalysis => {
  const totalResponses = surveys.length;

  // Initialize analysis object
  const analysis: IAnalysis = {
    totalResponses,
    demographics: {
      totalWithName: { count: 0, percentage: "0" },
      totalWithContact: { count: 0, percentage: "0" },
      totalWithAddress: { count: 0, percentage: "0" },
    },
    partyPreference: {},
    aapCandidates: {},
    bjpCandidates: {},
    congressCandidates: {},
    otherPartyCandidates: {},
  };

  // Process each survey
  surveys.forEach((survey) => {
    // Demographics
    if (survey.name) analysis.demographics.totalWithName.count++;
    if (survey.contact) analysis.demographics.totalWithContact.count++;
    if (survey.address) analysis.demographics.totalWithAddress.count++;

    // Party Preference
    const partyPreference =
      survey.preferredParty === "Other / अन्य"
        ? survey.customInputs?.preferredParty || "Other (Unspecified)"
        : survey.preferredParty;

    if (partyPreference) {
      if (!analysis.partyPreference[partyPreference]) {
        analysis.partyPreference[partyPreference] = {
          count: 0,
          percentage: "0",
        };
      }
      analysis.partyPreference[partyPreference].count++;
    }

    // AAP Candidates
    const aapCandidate =
      survey.aapCandidate === "Other / अन्य"
        ? survey.customInputs?.aapCandidate || "Other (Unspecified)"
        : survey.aapCandidate;

    if (aapCandidate) {
      if (!analysis.aapCandidates[aapCandidate]) {
        analysis.aapCandidates[aapCandidate] = { count: 0, percentage: "0" };
      }
      analysis.aapCandidates[aapCandidate].count++;
    }

    // BJP Candidates
    const bjpCandidate =
      survey.bjpCandidate === "Other / अन्य"
        ? survey.customInputs?.bjpCandidate || "Other (Unspecified)"
        : survey.bjpCandidate;

    if (bjpCandidate) {
      if (!analysis.bjpCandidates[bjpCandidate]) {
        analysis.bjpCandidates[bjpCandidate] = { count: 0, percentage: "0" };
      }
      analysis.bjpCandidates[bjpCandidate].count++;
    }

    // Congress Candidates
    if (survey.congressCandidate) {
      if (!analysis.congressCandidates[survey.congressCandidate]) {
        analysis.congressCandidates[survey.congressCandidate] = {
          count: 0,
          percentage: "0",
        };
      }
      analysis.congressCandidates[survey.congressCandidate].count++;
    }

    // Other Party Candidates
    if (survey.otherPartyCandidate) {
      if (!analysis.otherPartyCandidates[survey.otherPartyCandidate]) {
        analysis.otherPartyCandidates[survey.otherPartyCandidate] = {
          count: 0,
          percentage: "0",
        };
      }
      analysis.otherPartyCandidates[survey.otherPartyCandidate].count++;
    }
  });

  // Calculate percentages
  analysis.demographics.totalWithName.percentage = calculatePercentage(
    analysis.demographics.totalWithName.count,
    totalResponses
  );
  analysis.demographics.totalWithContact.percentage = calculatePercentage(
    analysis.demographics.totalWithContact.count,
    totalResponses
  );
  analysis.demographics.totalWithAddress.percentage = calculatePercentage(
    analysis.demographics.totalWithAddress.count,
    totalResponses
  );

  // Calculate percentages for all categories
  Object.keys(analysis.partyPreference).forEach((key) => {
    analysis.partyPreference[key].percentage = calculatePercentage(
      analysis.partyPreference[key].count,
      totalResponses
    );
  });

  Object.keys(analysis.aapCandidates).forEach((key) => {
    analysis.aapCandidates[key].percentage = calculatePercentage(
      analysis.aapCandidates[key].count,
      totalResponses
    );
  });

  Object.keys(analysis.bjpCandidates).forEach((key) => {
    analysis.bjpCandidates[key].percentage = calculatePercentage(
      analysis.bjpCandidates[key].count,
      totalResponses
    );
  });

  Object.keys(analysis.congressCandidates).forEach((key) => {
    analysis.congressCandidates[key].percentage = calculatePercentage(
      analysis.congressCandidates[key].count,
      totalResponses
    );
  });

  Object.keys(analysis.otherPartyCandidates).forEach((key) => {
    analysis.otherPartyCandidates[key].percentage = calculatePercentage(
      analysis.otherPartyCandidates[key].count,
      totalResponses
    );
  });

  return analysis;
};
