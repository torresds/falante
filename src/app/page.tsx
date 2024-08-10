"use client";
import { useReducer, useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/AudioPlayer";
import { cn } from "@/lib/utils";
import { Voice } from "@/utils/types";
import { voicesReducer, initialState } from "@/reducers/voicesReducer";
import { VoiceFilter } from "@/components/VoiceFilter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GenerateVoiceForm } from "@/components/VoiceForm";
import { GeneratedAudioPopUp } from "@/components/GeneratedVoicePopUp";

interface Filter {
  label: string;
  value: string;
}

type VoiceResponse = {
  voice: {
    url: string;
  };
};

export default function Home() {
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [selectedVoiceId, setSelectedVoiceID] = useState<string>("");
  const [labels, setLabels] = useState<Map<string, Set<string>>>(new Map());
  const [state, dispatch] = useReducer(voicesReducer, initialState);
  const [
    selectedVoiceSupportsMultiLanguage,
    setSelectedVoiceSupportsMultiLanguage,
  ] = useState<boolean>(false);
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch("/api/voices");
        const data = await response.json();
        dispatch({ type: "SET_VOICES", payload: data });

        const labelsMap = new Map<string, Set<string>>();
        data.forEach((voice: Voice) => {
          Object.entries(voice.labels).forEach(([key, value]) => {
            if (!labelsMap.has(key)) {
              labelsMap.set(key, new Set());
            }
            labelsMap.get(key)?.add(value);
          });
        });
        setLabels(labelsMap);
      } catch (error) {
        console.error("Erro ao buscar vozes:", error);
      }
    };

    fetchVoices();
  }, []);

  const handleFilterChange = (filters: Filter[]) => {
    dispatch({ type: "CLEAR_FILTERS" });
    filters.forEach((filter) => {
      dispatch({
        type: "ADD_FILTER",
        payload: { key: filter.label, value: filter.value },
      });
    });
  };

  const handleSelectVoice = (voiceName: string, voiceID: string) => {
    setSelectedVoiceName(voiceName);
    setSelectedVoiceID(voiceID);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onVoiceGenerated = (response: VoiceResponse) => {
    setGeneratedVoiceUrl(response.voice.url);
  };

  return (
    <>
      <GeneratedAudioPopUp
        audioUrl={generatedVoiceUrl}
        open={!!generatedVoiceUrl}
        onClose={() => setGeneratedVoiceUrl("")}
      />
      <div className="grid place-items-center w-full px-4">
        <div ref={formRef}>
          <GenerateVoiceForm
            onVoiceGenerated={onVoiceGenerated}
            selectedModel={selectedVoiceName}
            selectedModelId={selectedVoiceId}
            multiLanguage={selectedVoiceSupportsMultiLanguage}
          />
        </div>

        <VoiceFilter
          labels={labels}
          labelsDictionary={{
            description: "Características",
            accent: "Sotaque",
            age: "Idade",
            use_case: "Uso recomendado",
            gender: "Gênero",
          }}
          onFilterChange={handleFilterChange}
        />

        {state.filteredVoices?.length ? (
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl",
            )}
          >
            {state.filteredVoices.map((voice: Voice) => (
              <Card
                key={voice.voice_id}
                className={
                  selectedVoiceName === voice.name
                    ? "border-2 border-blue-500"
                    : ""
                }
              >
                <CardHeader>
                  <CardTitle>{voice.name}</CardTitle>
                  <CardDescription className="flex gap-2">
                    <p className="font-bold">{voice.category}</p>
                    {voice.high_quality_base_model_ids.includes(
                      "eleven_turbo_v2_5",
                    ) && (
                      <Badge className="bg-green-600 text-foreground">
                        Suporta multi-idioma
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(voice.labels)
                      .filter(([, value]) => !state.labels.has(value))
                      .map(([key, value]) => (
                        <Badge key={key}>{value}</Badge>
                      ))}
                  </div>
                  <Separator className="my-2" />
                  <AudioPlayer
                    audioUrl={voice.preview_url}
                    text="Tocar prévia"
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      setSelectedVoiceSupportsMultiLanguage(
                        voice.high_quality_base_model_ids.includes(
                          "eleven_turbo_v2_5",
                        ),
                      );
                      handleSelectVoice(voice.name, voice.voice_id);
                    }}
                  >
                    Selecionar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </>
  );
}
