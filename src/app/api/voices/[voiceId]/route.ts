import { type NextRequest, NextResponse } from "next/server";
import { generateVoice, getVoice } from "@/services/ElevenLabs";

export async function GET(
  request: NextRequest,
  { params }: { params: { voiceId: string } },
) {
  const { voiceId } = params;
  try {
    console.log(voiceId);
    const voice = await getVoice(voiceId);
    console.log(voice);
    if (!voice) {
      return NextResponse.json(
        { error: "Voz não encontrada." },
        { status: 400 },
      );
    }
    return NextResponse.json(voice, { status: 200 });
  } catch (err) {
    console.error("Erro ao obter voz: ", err);
    return NextResponse.json(
      { error: "Erro ao obter voz no ElevenLabs." },
      { status: 500 },
    );
  }
}
