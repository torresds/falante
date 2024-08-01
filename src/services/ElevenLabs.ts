import fetch from "node-fetch";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";

const baseUrl = "https://api.elevenlabs.io/v1/";
export const languages = [
  "Chinese",
  "Korean",
  "Dutch",
  "Turkish",
  "Swedish",
  "Indonesian",
  "Filipino",
  "Japanese",
  "Ukrainian",
  "Greek",
  "Czech",
  "Finnish",
  "Romanian",
  "Russian",
  "Danish",
  "Bulgarian",
  "Malay",
  "Slovak",
  "Croatian",
  "Classic Arabic",
  "Tamil",
  "English",
  "Polish",
  "German",
  "Spanish",
  "French",
  "Italian",
  "Hindi",
  "Portuguese",
  "Hungarian",
  "Vietnamese",
  "Norwegian",
];

export const request = async (
  method: "GET" | "POST",
  endpoint: string,
  data?: any,
) => {
  if (method === "POST" && !data) {
    throw new TypeError("Não é possível realizar requisições POST sem dados.");
  }
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      "Content-Type": data ? "application/json" : "",
      "x-api-key": process.env.ELEVENLABS_API_KEY as string,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response;
};

export const getVoices = async () => {
  try {
    const voices = await request("GET", "voices");
    if (voices.status == 200) {
      return ((await voices.json()) as any).voices;
    }
    return [];
  } catch (err) {
    console.log("Erro ao obter vozes do ElevenLabs: ", err);
    return [];
  }
};

export const generateVoice = async (
  voiceId: string,
  text: string,
  language: string,
) => {
  try {
    if (languages.indexOf(language) === -1) {
      return {};
    }
    const generatedVoice = await request("POST", `text-to-speech/${voiceId}`, {
      text,
      data: {
        language,
      },
    });
    const blob = await generatedVoice.blob();
    const blobText = await blob.text();
    if (blobText.includes("voice_not_found")) {
      return {};
    }
    const file_name = nanoid();
    const vercelBlob = await put(file_name, blob, {
      access: "public",
    });
    return vercelBlob;
  } catch (err) {
    console.log("Erro ao gerar voz do ElevenLabs: ", err);
    return {};
  }
};
