
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const identifyStudent = async (
  currentPhotoBase64: string,
  enrolledStudents: Student[]
): Promise<{ studentId: string | null; confidence: number; name: string | null }> => {
  if (enrolledStudents.length === 0) {
    return { studentId: null, confidence: 0, name: null };
  }

  // Create image parts for all enrolled students
  const studentParts = enrolledStudents.flatMap(s => [
    { text: `Student Name: ${s.name}, ID: ${s.id}` },
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: s.photoBase64.split(',')[1] || s.photoBase64
      }
    }
  ]);

  const testPart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: currentPhotoBase64.split(',')[1] || currentPhotoBase64
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: "System instruction: You are a high-precision facial recognition engine. I will provide you with images of enrolled students and a single test image. Identify if the person in the test image matches any of the enrolled students." },
          ...studentParts,
          { text: "Test Image (to be identified):" },
          testPart
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentId: {
              type: Type.STRING,
              description: "The ID of the matching student, or 'unknown' if no match is found.",
            },
            name: {
              type: Type.STRING,
              description: "The name of the matching student.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1.",
            }
          },
          required: ["studentId", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    if (result.studentId === 'unknown' || result.confidence < 0.7) {
      return { studentId: null, confidence: result.confidence || 0, name: null };
    }

    return {
      studentId: result.studentId,
      name: result.name,
      confidence: result.confidence
    };
  } catch (error) {
    console.error("Recognition Error:", error);
    return { studentId: null, confidence: 0, name: null };
  }
};
