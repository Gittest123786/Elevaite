
import { GoogleGenAI, Type } from "@google/genai";
import { PricingTier } from "../app/types.js";
import { getMockMarketInsights, getMockTailoredCV } from "./mockData.js";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    globalPercentile: { type: Type.INTEGER },
    feedback: { type: Type.STRING },
    strategicNarrative: { type: Type.STRING },
    radarData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          A: { type: Type.INTEGER },
          fullMark: { type: Type.INTEGER }
        },
        required: ["subject", "A", "fullMark"]
      }
    },
    gaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          gap: { type: Type.STRING },
          gapDescription: { type: Type.STRING },
          category: { type: Type.STRING },
          competencyLevel: { type: Type.INTEGER },
          suggestion: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              provider: { type: Type.STRING },
              description: { type: Type.STRING },
              duration: { type: Type.STRING },
              completed: { type: Type.BOOLEAN },
              url: { type: Type.STRING },
            },
            required: ["id", "title", "provider", "description", "duration", "completed", "url"],
          },
        },
        required: ["gap", "gapDescription", "category", "suggestion", "competencyLevel"],
      },
    },
    careerRoadmap: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    apprenticeshipPath: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
          companies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "reason", "companies"]
      }
    },
    interviewPrep: {
        type: Type.OBJECT,
        properties: {
            questions: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["questions", "strategicTips"]
    }
  },
  required: ["score", "globalPercentile", "feedback", "gaps", "radarData", "careerRoadmap", "apprenticeshipPath"],
};

const cvSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        contact: { type: Type.STRING },
        location: { type: Type.STRING },
      },
      required: ["name", "contact", "location"],
    },
    professionalSummary: { type: Type.STRING },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          duration: { type: Type.STRING },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["role", "company", "duration", "achievements"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          year: { type: Type.STRING },
        },
        required: ["degree", "institution", "year"],
      },
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    templateId: { type: Type.STRING }
  },
  required: ["personalInfo", "professionalSummary", "experience", "education", "skills"],
};

const ucasSchema = {
  type: Type.OBJECT,
  properties: {
    courseChoice: { type: Type.STRING },
    universityGoal: { type: Type.STRING },
    statementBody: { type: Type.STRING },
    structureGuidance: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["courseChoice", "universityGoal", "statementBody", "structureGuidance"]
};

export const analyseCV = async (content, mimeType = null, careerGoal = '', userProfile) => {
  try {
    const tier = userProfile?.selectedTier || PricingTier.STARTER;
    const region = userProfile?.region || 'Global';
    const model = "gemini-3-flash-preview";
    
    let tierContext = "";
    if (tier === PricingTier.STARTER) {
        tierContext = `Plan: Starter. Focus: Simple, foundational growth. Ensure exactly 3 "Core Gaps" split between 'Technical' and 'Soft'.`;
    } else if (tier === PricingTier.PRO) {
        tierContext = `Plan: Pro. Focus: Comprehensive "Skill Map". assertive career direction.`;
    } else if (tier === PricingTier.ELITE) {
        tierContext = `Plan: Elite. Focus: High-level "Mastery Map". strategic leadership benchmarks.`;
    }

    const systemInstruction = `You are "elevAIte", an elite AI career coach. Tone: Professional and data-driven. Goal: Perform a gap analysis for "${careerGoal}" in ${region}. ${tierContext}`;

    const response = await ai.models.generateContent({
      model,
      contents: mimeType 
        ? { parts: [{ inlineData: { mimeType, data: content } }, { text: `Analyze for: ${careerGoal} in ${region}.` }] } 
        : `Role: ${careerGoal}\nRegion: ${region}\n\nInfo:\n${content}`,
      config: { systemInstruction, responseMimeType: "application/json", responseSchema: analysisSchema, temperature: 0.7 },
    });

    return JSON.parse(response.text);
  } catch (error) { throw error; }
};

export const generateTailoredCV = async (content, mimeType, careerGoal, userProfile, analysisResult) => {
    try {
        const region = userProfile?.region || 'Global';
        const tier = userProfile?.selectedTier || PricingTier.STARTER;
        const model = "gemini-3-flash-preview";

        const masteredSkills = analysisResult?.gaps.filter(g => g.suggestion.completed).map(g => g.gap) || [];
        const targetSkills = analysisResult?.gaps.filter(g => !g.suggestion.completed).map(g => g.gap) || [];

        const systemInstruction = `You are elevAIte's Senior CV Architect. Re-engineer the candidate's history for "${careerGoal}" in ${region}. Tier: ${tier}. Mastered: ${masteredSkills.join(', ')}. Targets: ${targetSkills.join(', ')}.`;
        
        const response = await ai.models.generateContent({
            model,
            contents: mimeType 
              ? { parts: [{ inlineData: { mimeType, data: content } }, { text: `Target Role: ${careerGoal}.` }] } 
              : `Target Role: ${careerGoal}\n\nCandidate Profile:\n${content}`,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: cvSchema, temperature: 0.6 },
        });
        
        return JSON.parse(response.text);
    } catch (e) { 
        console.warn("CV Generation failed, falling back to tiered mock data:", e);
        if (userProfile) {
            return getMockTailoredCV(userProfile, userProfile.selectedTier || PricingTier.STARTER);
        }
        throw e;
    }
};

export const generateUCASStatement = async (userProfile) => {
    try {
        const model = "gemini-3-flash-preview";
        const prompt = `Name: ${userProfile.name}. Goal: ${userProfile.careerAspirations}. Education: ${userProfile.educationLevel}`;
        const systemInstruction = `University Specialist. Generate a UCAS draft.`;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: ucasSchema, temperature: 0.7 },
        });
        return JSON.parse(response.text);
    } catch (e) { throw e; }
};

export const fetchMarketInsights = async (careerGoal, region = 'Global') => {
    try {
        const model = "gemini-3-flash-preview";
        const response = await ai.models.generateContent({
            model: model,
            contents: `Market insights for: ${careerGoal} in ${region}.`,
            config: { 
              systemInstruction: `Career Analyst. Provide salary ranges and competition levels.`, 
              responseMimeType: "application/json", 
              temperature: 0.5 
            },
        });
        return JSON.parse(response.text);
    } catch (e) { 
        console.warn("Gemini Market Insights failed, falling back to mock data:", e);
        return getMockMarketInsights(careerGoal, region); 
    }
};

export const generateRecruiterInsights = async (candidates) => {
    try {
        const model = "gemini-3-pro-preview";
        const response = await ai.models.generateContent({
            model,
            contents: `Cohort Analysis: ${JSON.stringify(candidates)}`,
            config: { 
                systemInstruction: "Talent Acquisition Strategist. Summarize workforce gaps and training recommendations.", 
                responseMimeType: "application/json", 
                temperature: 0.7 
            },
        });
        return JSON.parse(response.text);
    } catch (e) { throw e; }
};

export const rankCandidatesForJob = async (jobDetails, candidates, region = 'Global') => {
    try {
        const model = "gemini-3-pro-preview";
        const response = await ai.models.generateContent({
            model,
            contents: `Job: ${jobDetails}. Rank candidates: ${JSON.stringify(candidates)}`,
            config: { 
                systemInstruction: "Talent Scout. Return ranked candidate matches.", 
                responseMimeType: "application/json", 
                temperature: 0.3 
            },
        });
        const parsed = JSON.parse(response.text);
        return parsed.matches || [];
    } catch (e) { return []; }
};

export const suggestCareers = async (content, mimeType = null, region = 'Global') => {
    try {
        const model = "gemini-3-flash-preview";
        const response = await ai.models.generateContent({
            model,
            contents: mimeType 
              ? { parts: [{ inlineData: { mimeType, data: content } }, { text: `Suggest career paths.` }] } 
              : content,
            config: { systemInstruction: `Career Counselor in ${region}. Recommend 3 paths.`, responseMimeType: "application/json", temperature: 0.7 },
        });
        const parsed = JSON.parse(response.text);
        return parsed.careers || parsed;
    } catch (e) { throw e; }
};
