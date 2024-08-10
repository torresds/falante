import { type NextRequest, NextResponse } from "next/server";
import { generateVoice, supportMultipleLanguages } from "@/services/ElevenLabs";

export async function POST(
  request: NextRequest,
  { params }: { params: { audioId: string } },
) {
  try {
    const { audioId } = params;
    const body = await request.json();
    if (!body.text) {
      return NextResponse.json({ error: "Faltando texto." }, { status: 400 });
    }
    if (body.language) {
      const support = await supportMultipleLanguages(audioId);
      if (!support) {
        return NextResponse.json(
          { error: "Este modelo não suporta múltiplos idiomas." },
          { status: 400 },
        );
      }
    }
    const voice = await generateVoice(audioId, body.text, body.language);
    return NextResponse.json({ voice }, { status: 200 });
  } catch (err) {
    if (err == "language_not_found") {
      return NextResponse.json(
        { error: "Idioma não encontrado ou não suportado." },
        { status: 400 },
      );
    }
    if (err == "voice_not_found") {
      return NextResponse.json(
        { error: "Modelo de voz não encontrado." },
        { status: 404 },
      );
    }
    console.error("Erro ao gerar voz: ", err);
    return NextResponse.json(
      { error: "Erro ao gerar voz no ElevenLabs." },
      { status: 500 },
    );
  }
}
