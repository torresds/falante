import { NextResponse } from "next/server";

import { getVoices } from "@/services/ElevenLabs";

export async function GET() {
  try {
    const voices = (await getVoices()) as any[];
    if (!voices.length) {
      return NextResponse.json(
        { error: "Erro ao buscar vozes no ElevenLabs." },
        { status: 500 },
      );
    }
    return NextResponse.json(voices, { status: 200 });
  } catch (err) {
    console.error("Erro ao buscar vozes no ElevenLabs: ", err);
    return NextResponse.json(
      { error: "Erro ao buscar vozes no ElevenLabs." },
      { status: 500 },
    );
  }
}
