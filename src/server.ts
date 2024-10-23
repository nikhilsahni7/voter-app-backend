import express from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Parser } from "json2csv";
import dotenv from "dotenv";
import Survey from "./models/survey";
import { generateAnalysis } from "./utils/analysis";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/survey_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.post("/api/surveys", async (req: Request, res: Response) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    console.log(error);
  }
});

app.get("/api/surveys", async (_req: Request, res: Response) => {
  try {
    const surveys = await Survey.find({}).sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/api/surveys/:id", async (req: Request, res: any) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/api/analysis", async (_req: Request, res: Response) => {
  try {
    const surveys = await Survey.find({});
    const analysis = generateAnalysis(surveys);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/api/export-csv", async (_req: Request, res: Response) => {
  try {
    const surveys = await Survey.find({}).sort({ createdAt: -1 });

    // Transform and clean the data to handle text formatting
    const transformedSurveys = surveys.map((survey) => ({
      name: (survey.name || "").replace(/[\n\r,]/g, " ").trim(),
      contact: (survey.contact || "").replace(/[\n\r,]/g, " ").trim(),
      address: (survey.address || "").replace(/[\n\r,]/g, " ").trim(),
      preferredParty: (survey.preferredParty === "Other / अन्य"
        ? survey.customInputs?.preferredParty || "Other"
        : survey.preferredParty || ""
      )
        .replace(/[\n\r,]/g, " ")
        .trim(),
      aapCandidate: (survey.aapCandidate === "Other / अन्य"
        ? survey.customInputs?.aapCandidate || "Other"
        : survey.aapCandidate || ""
      )
        .replace(/[\n\r,]/g, " ")
        .trim(),
      bjpCandidate: (survey.bjpCandidate === "Other / अन्य"
        ? survey.customInputs?.bjpCandidate || "Other"
        : survey.bjpCandidate || ""
      )
        .replace(/[\n\r,]/g, " ")
        .trim(),
      congressCandidate: (survey.congressCandidate || "")
        .replace(/[\n\r,]/g, " ")
        .trim(),
      otherPartyCandidate: (survey.otherPartyCandidate || "")
        .replace(/[\n\r,]/g, " ")
        .trim(),
      submissionDate: survey?.createdAt
        ? new Date(survey.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        : "",
    }));

    const fields = [
      {
        label: "Name / नाम",
        value: "name",
        // Properly escape and quote values
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "Contact / संपर्क",
        value: "contact",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "Address / पता",
        value: "address",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "Preferred Party / पसंदीदा पार्टी",
        value: "preferredParty",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "AAP Candidate / आप उम्मीदवार",
        value: "aapCandidate",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "BJP Candidate / भाजपा उम्मीदवार",
        value: "bjpCandidate",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "Congress Candidate / कांग्रेस उम्मीदवार",
        value: "congressCandidate",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "Other Party Candidate / अन्य पार्टी उम्मीदवार",
        value: "otherPartyCandidate",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
      {
        label: "Submission Date / जमा करने की तिथि",
        value: "submissionDate",
        stringify: (value: any) => JSON.stringify(value).slice(1, -1),
      },
    ];

    const json2csvParser = new Parser({
      fields,
      delimiter: ",",
      quote: '"',
      escapedQuote: '""',
      header: true,
    });

    const csv = json2csvParser.parse(transformedSurveys);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=survey_data.csv"
    );

    // Add BOM for Excel to properly recognize UTF-8
    const BOM = "\uFEFF";
    res.send(BOM + csv);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
