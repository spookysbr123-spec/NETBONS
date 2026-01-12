
import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

// Inicialização segura para o ambiente de produção
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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
    console.error("Erro ao buscar recomendação Gemini:", error);
    throw error;
  }
};

export const getMetadataFromFilename = async (filename: string): Promise<Partial<Movie>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o nome do arquivo de vídeo: "${filename}". Com base nisso, deduza o título real do filme/série, crie uma descrição curta no estilo Netflix, defina gêneros adequados e classificação etária. Retorne JSON.`,
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
      rating: 8.5 + (Math.random() * 1.4),
    };
  } catch (error) {
    return {
      title: filename.split('.')[0],
      description: "Conteúdo adicionado pelo usuário via Laboratório.",
      genre: ["Vídeo Local"],
      year: new Date().getFullYear(),
      rating: 8.0,
      ageRating: 'L'
    };
  }
};

export const getMoreInfoAboutMovie = async (movieTitle: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique por que o filme "${movieTitle}" é uma recomendação obrigatória no estilo da Netflix. Seja entusiasta e use no máximo 3 frases.`,
    });
    return response.text || "Este título é um dos mais aguardados da temporada.";
  } catch (error) {
    return "Um conteúdo exclusivo que redefine o gênero com uma narrativa envolvente.";
  }
};
