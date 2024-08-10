import fetch from "node-fetch";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import { languages, languageNames, languagesCodes } from "@/utils/languages";
import { Voice } from "@/utils/types";

const baseUrl = "https://api.elevenlabs.io/v1/";

export const request = async (
  method: "GET" | "POST",
  endpoint: string,
  data?: any,
) => {
  if (method === "POST" && !data) {
    throw new TypeError("Não é possível realizar requisições POST sem dados.");
  }

  const headers: HeadersInit = {
    "xi-api-key": process.env.ELEVENLABS_API_KEY as string,
  };

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  return response;
};

export const getVoices = async (): Promise<Voice[]> => {
  try {
    const apiResponse = await request("GET", "voices");
    const data = (await apiResponse.json()) as { voices: Voice[] };
    return data.voices;
  } catch (err) {
    console.error("Erro ao obter vozes do ElevenLabs:", err);
    return [];
  }
};

export const getVoice = async (voiceId: string): Promise<Voice> => {
  try {
    const voiceDetails = await request("GET", `voices/${voiceId}`);
    const voice = (await voiceDetails.json()) as Voice;
    return voice;
  } catch (err) {
    console.error("Erro ao obter voz do ElevenLabs:", err);
    return Promise.reject(err);
  }
};

export const generateVoice = async (
  voiceId: string,
  text: string,
  language?: string,
) => {
  try {
    if (
      language &&
      !languageNames.includes(language) &&
      !languagesCodes.includes(language)
    ) {
      return Promise.reject("language_not_found");
    }

    const voiceModel = await getVoice(voiceId);
    if (!voiceModel) {
      return Promise.reject("voice_not_found");
    }

    if (
      !voiceModel.high_quality_base_model_ids?.includes("eleven_turbo_v2_5")
    ) {
      return Promise.reject("model_not_supported");
    }

    const generatedVoice = await request("POST", `text-to-speech/${voiceId}`, {
      text,
      language: language
        ? languageNames.includes(language)
          ? languages[language]
          : language
        : "None",
      model: language ? "default" : "eleven_turbo_v2_5",
    });

    const blob = await generatedVoice.blob();
    const blobText = await blob.text();

    if (blobText.includes("voice_not_found")) {
      return Promise.reject("voice_not_found");
    }

    const fileName = nanoid();
    const vercelBlob = await put(fileName, blob, {
      access: "public",
    });

    return vercelBlob;
  } catch (err) {
    console.error("Erro ao gerar voz do ElevenLabs:", err);
    return Promise.reject(err);
  }
};

export const supportMultipleLanguages = async (
  voiceId: string,
): Promise<boolean> => {
  try {
    const voiceModel = await getVoice(voiceId);
    if (!voiceModel) {
      return Promise.reject("voice_not_found");
    }
    return (
      voiceModel.high_quality_base_model_ids?.includes("eleven_turbo_v2_5") ??
      false
    );
  } catch (err) {
    console.error("Erro ao verificar suporte a múltiplos idiomas:", err);
    return Promise.reject(err);
  }
};
