
import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

// Função de detecção de API KEY à prova de falhas
const getApiKeySecure = (): string => {
  try {
    // Tenta acessar via process.env com verificação de existência
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // Fallback para globalThis caso o bundler injete de outra forma
    const g = globalThis as any;
    if (g.process?.env?.API_KEY) return g.process.env.API_KEY;
  } catch (e) {
    console.warn("Ambiente de chaves não detectado.");
  }
  return "";
};

// Inicialização segura - só cria a instância quando necessário
const createAI = () => {
  const key = getApiKeySecure();
  return new GoogleGenAI({ apiKey: key });
};

export const getMovieRecommendation = async (userPreference: string): Promise<Partial<Movie>> => {
  try {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um filme fictício Netflix para o tema: "${userPreference}". Retorne JSON puro.`,
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
      id: 'gen-' + Math.random().toString(36).substr(2, 9),
      backdropPath: `https://picsum.photos/seed/${encodeURIComponent(result.title || 'movie')}/1920/1080`,
      posterPath: `https://picsum.photos/seed/${encodeURIComponent(result.title || 'movie')}/500/750`,
      isOriginal: true
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const getMetadataFromFilename = async (filename: string): Promise<Partial<Movie>> => {
  try {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extraia metadados de filme do arquivo: "${filename}". Retorne JSON.`,
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
    return { ...result, rating: 8.5 };
  } catch (error) {
    return {
      title: filename.split('.')[0],
      description: "Vídeo enviado pela comunidade.",
      genre: ["Comunidade"],
      year: new Date().getFullYear(),
      rating: 8.0,
      ageRating: 'L'
    };
  }
};

export const getMoreInfoAboutMovie = async (movieTitle: string): Promise<string> => {
  try {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Resuma por que assistir "${movieTitle}" em 10 palavras.`,
    });
    return response.text || "Uma experiência visual única disponível agora.";
  } catch (error) {
    return "Um título envolvente que você não pode perder.";
  }
};
