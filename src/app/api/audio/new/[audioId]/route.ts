import { type NextRequest, NextResponse } from "next/server";
import { generateVoice } from "@/services/ElevenLabs";

export async function POST(
  request: NextRequest,
  { params }: { params: { audioId: string } },
) {
  try {
    const { audioId } = params;
    const body = await request.json();
    if (!body.language || !body.text) {
      return NextResponse.json(
        { error: "Faltando idioma e/ou texto." },
        { status: 400 },
      );
    }
    const voice = await generateVoice(audioId, body.text, body.language);
    if (!voice) {
      return NextResponse.json(
        { error: "Idioma não suportado." },
        { status: 400 },
      );
    }
    return NextResponse.json({ voice }, { status: 200 });
  } catch (err) {
    console.error("Erro ao gerar voz: ", err);
    return NextResponse.json(
      { error: "Erro ao gerar voz no ElevenLabs." },
      { status: 500 },
    );
  }
}
