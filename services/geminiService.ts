
import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

// Acesso seguro ao process.env para evitar ReferenceError em navegadores puros
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getMovieRecommendation = async (userPreference: string): Promise<Partial<Movie>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere uma ideia de filme fictício para a Netflix com base no seguinte interesse: "${userPreference}". Retorne apenas JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            genre: { type: Type.ARRAY, items: { type: Type.STRING } },
            year: { type: Type.NUMBER },
            rating: { type: Type.NUMBER },
            ageRating: { type: Type.STRING, enum: ['L', '10', '12', '14', '16', '18'] }
          },
          required: ["title", "description", "genre", "year", "rating", "ageRating"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      backdropPath: `https://picsum.photos/seed/${encodeURIComponent(result.title)}/1920/1080`,
      posterPath: `https://picsum.photos/seed/${encodeURIComponent(result.title)}/500/750`,
      isOriginal: true
    };
  } catch (error) {
    console.error("Erro Gemini:", error);
    throw error;
  }
};

export const getMetadataFromFilename = async (filename: string): Promise<Partial<Movie>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o nome do arquivo de vídeo: "${filename}". Deduza título, descrição curta (estilo Netflix), gêneros e classificação. Retorne JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            genre: { type: Type.ARRAY, items: { type: Type.STRING } },
            year: { type: Type.NUMBER },
            ageRating: { type: Type.STRING, enum: ['L', '10', '12', '14', '16', '18'] }
          },
          required: ["title", "description", "genre", "year", "ageRating"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      rating: 8.0 + (Math.random() * 2),
    };
  } catch (error) {
    return {
      title: filename.split('.')[0],
      description: "Conteúdo pessoal adicionado ao Laboratório.",
      genre: ["Vídeo"],
      year: new Date().getFullYear(),
      rating: 8.5,
      ageRating: 'L'
    };
  }
};

export const getMoreInfoAboutMovie = async (movieTitle: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Por que o filme "${movieTitle}" é imperdível na Netflix? Máximo 20 palavras.`,
    });
    return response.text || "Um clássico instantâneo que você precisa conferir.";
  } catch (error) {
    return "Uma narrativa poderosa que redefine o gênero.";
  }
};
