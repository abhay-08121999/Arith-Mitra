import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FraudAnalysisResult, LoanPredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const analyzeFraud = async (text: string): Promise<FraudAnalysisResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isFraud: { type: Type.BOOLEAN },
      riskScore: { type: Type.NUMBER, description: "0 to 100, where 100 is high risk" },
      explanation: { type: Type.STRING },
      advice: { type: Type.STRING }
    },
    required: ["isFraud", "riskScore", "explanation", "advice"]
  };

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Analyze the following text (SMS/Email) for potential financial fraud, phishing, or scam attempts. Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as FraudAnalysisResult;
};

export const predictLoanEligibility = async (
  income: number,
  creditScore: number,
  existingEmi: number,
  requestedAmount: number,
  tenure: number
): Promise<LoanPredictionResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      eligibilityScore: { type: Type.NUMBER, description: "0 to 100 probability" },
      status: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
      reasoning: { type: Type.STRING },
      tips: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["eligibilityScore", "status", "reasoning", "tips"]
  };

  const prompt = `
    Evaluate loan eligibility for a user with:
    - Monthly Income: ${income}
    - Credit Score: ${creditScore}
    - Existing Monthly EMIs: ${existingEmi}
    - Requested Loan Amount: ${requestedAmount}
    - Loan Tenure: ${tenure} years.

    Provide a realistic assessment based on standard financial risk models.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  return JSON.parse(response.text || '{}') as LoanPredictionResult;
};

export const getChatStream = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  const chat = ai.chats.create({
    model: MODEL_FLASH,
    history: history,
    config: {
      systemInstruction: "You are ArithMitra, a helpful, polite, and knowledgeable financial assistant. Keep answers concise but informative. You are capable of conversing fluently in English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, and Bengali. Always respond in the language the user is speaking or asks for.",
    }
  });

  return await chat.sendMessageStream({ message: newMessage });
};