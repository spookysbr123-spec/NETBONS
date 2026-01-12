
import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

// Função para obter a chave de forma que nunca quebre o script
const safeGetApiKey = (): string => {
  try {
    // Verifica se 'process' existe antes de acessar 'env'
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Ambiente sem process.env detectado.");
  }
  return "";
};

// Inicialização adiada/segura
const getAIInstance = () => {
  const apiKey = safeGetApiKey();
  return new GoogleGenAI({ apiKey });
};

export const getMovieRecommendation = async (userPreference: string): Promise<Partial<Movie>> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere uma ideia de filme fictício para a Netflix com base no interesse: "${userPreference}". Retorne apenas JSON puro.`,
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
      backdropPath: `https://picsum.photos/seed/${encodeURIComponent(result.title || 'movie')}/1920/1080`,
      posterPath: `https://picsum.photos/seed/${encodeURIComponent(result.title || 'movie')}/500/750`,
      isOriginal: true
    };
  } catch (error) {
    console.error("Erro Gemini:", error);
    throw error;
  }
};

export const getMetadataFromFilename = async (filename: string): Promise<Partial<Movie>> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o nome do arquivo: "${filename}". Deduza título, descrição curta, gêneros e classificação. Retorne JSON.`,
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
      rating: 8.5,
    };
  } catch (error) {
    return {
      title: filename.split('.')[0],
      description: "Conteúdo pessoal carregado no Netbons.",
      genre: ["Vídeo"],
      year: new Date().getFullYear(),
      rating: 8.0,
      ageRating: 'L'
    };
  }
};

export const getMoreInfoAboutMovie = async (movieTitle: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique brevemente por que assistir "${movieTitle}". Máximo 15 palavras.`,
    });
    return response.text || "Uma escolha excelente para o seu catálogo.";
  } catch (error) {
    return "Um título envolvente que você não pode perder.";
  }
};
