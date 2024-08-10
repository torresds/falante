"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/AudioPlayer";
import useLocalStorage from "@/hooks/useLocalStorage";
import Link from "next/link";
import { useState, memo } from "react";

interface HistoryItem {
  generatedAt: string;
  url: string;
  content: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("history", []);

  const handleRemove = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Histórico de áudios</h1>
      <div className="flex flex-col gap-1 m-auto md:flex-wrap md:flex-row">
        {history.map((item, index) => (
          <Card
            key={item.generatedAt}
            className="max-w-[450px] flex flex-col place-content-center"
          >
            <CardHeader>
              <h1 className="text-lg font-bold">{`Áudio ${index + 1} de ${history.length}`}</h1>
            </CardHeader>
            <CardContent>
              <TruncatedText content={item.content} />
              <AudioPlayer text="Tocar prévia" audioUrl={item.url} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="ghost">
                <Link target="_blank" href={`${item.url}?download=1`}>
                  Baixar áudio
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleCopyText(item.content)}
              >
                Copiar texto
              </Button>
              <Button variant="destructive" onClick={() => handleRemove(index)}>
                Remover do histórico
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

const TruncatedText = memo(({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = content.length > 100;

  return (
    <div>
      <p className={`text-sm ${isExpanded ? "" : "truncate"}`}>
        {isExpanded ? content : content.slice(0, 100)}
        {!isExpanded && shouldTruncate && "..."}
      </p>
      {shouldTruncate && (
        <Button
          variant="link"
          className="p-0 text-blue-600"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Mostrar menos" : "Mostrar mais"}
        </Button>
      )}
    </div>
  );
});

TruncatedText.displayName = "TruncatedText";
