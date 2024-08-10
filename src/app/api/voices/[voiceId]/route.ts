import { type NextRequest, NextResponse } from "next/server";
import { getVoice } from "@/services/ElevenLabs";

export async function GET(
  _: NextRequest,
  { params }: { params: { voiceId: string } },
) {
  const { voiceId } = params;
  try {
    const voice = await getVoice(voiceId);
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
