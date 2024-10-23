// models/survey.ts
import mongoose, { Document } from "mongoose";
import type { ISurvey } from "../types/survey";

export interface ISurveyDocument extends ISurvey, Document {}

const SurveySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    preferredParty: {
      type: String,
      default: "",
    },
    aapCandidate: {
      type: String,
      default: "",
    },
    bjpCandidate: {
      type: String,
      default: "",
    },
    congressCandidate: {
      type: String,
      default: "",
    },
    otherPartyCandidate: {
      type: String,
      default: "",
    },
    customInputs: {
      preferredParty: { type: String, default: "" },
      aapCandidate: { type: String, default: "" },
      bjpCandidate: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISurveyDocument>("Survey", SurveySchema);
