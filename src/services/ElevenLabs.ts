import fetch from "node-fetch";
import { nanoid } from "nanoid";
import { writeFile } from "fs/promises";

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
