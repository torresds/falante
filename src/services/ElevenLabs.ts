import fetch from "node-fetch";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import { languages } from "@/utils/languages";
const baseUrl = "https://api.elevenlabs.io/v1/";

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
      "xi-api-key": process.env.ELEVENLABS_API_KEY as string,
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

export const getVoice = async (voiceId: string) => {
  try {
    const voices = await request("GET", `voices/${voiceId}`);
    console.log(voices.status);
    if (voices.status == 200) {
      console.log("Voz:", voices);
      return voices.json();
    }
    return {};
  } catch (err) {
    console.log("Erro ao obter voz do ElevenLabs: ", err);
    return {};
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
