"use client";

import { useReducer, useState } from "react";
import useSWR from "swr";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import AudioPlayer from "@/components/AudioPlayer";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import { cn } from "@/lib/utils";
import { Voice } from "@/utils/types";
import { voicesReducer, initialState } from "@/reducers/voicesReducer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [labels, setLabels] = useState(new Map<string, Set<string>>());
  const [state, dispatch] = useReducer(voicesReducer, initialState);
  const [isFiltering, setIsFiltering] = useState(false);

  const { error, isLoading } = useSWR("/api/voices", (...args) =>
    fetch(...args).then(async (res) => {
      const jsonResult = await res.json();
      dispatch({ type: "SET_VOICES", payload: jsonResult });
      const newLabels = new Map<string, Set<string>>();
      jsonResult.forEach((voice: Voice) => {
        Object.keys(voice.labels).forEach((key) => {
          if (!newLabels.has(key)) {
            newLabels.set(key, new Set());
          }
          newLabels.get(key)?.add(voice.labels[key]);
        });
      });
      setLabels(newLabels);
    }),
  );

  const addFilter = (label: string, value: string) => {
    dispatch({ type: "ADD_FILTER", payload: { key: label, value } });
  };

  const removeFilter = (label: string, value: string) => {
    dispatch({ type: "REMOVE_FILTER", payload: { key: label, value } });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const labelsDictionary = {
    description: "Características",
    accent: "Sotaque",
    age: "Idade",
    use_case: "Uso recomendado",
    gender: "Gênero",
  };

  return (
    <>
      <div className="grid place-items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl text-center mt-4">
            Escolha seu modelo de voz:
          </h1>
          <div className="flex place-center place-items-center flex-row md:flex-row gap-4 my-4 xl:w-auto border rounded p-4">
            {!isLoading && (
              <>
                <Switch
                  checked={isFiltering}
                  onClick={() => setIsFiltering(!isFiltering)}
                  id="filters"
                />
                <Label htmlFor="filters">Filtrar modelos</Label>
                {isFiltering && (
                  <Button onClick={clearFilters} className="ml-4">
                    Limpar filtros
                  </Button>
                )}
              </>
            )}
          </div>

          {isFiltering && (
            <div className="flex flex-col w-full max-w-6xl mb-6 xl:grid xl:grid-cols-3 gap-4">
              {Array.from(labels.entries()).map(([key, values]) => (
                <Card
                  key={key}
                  className="bg-gray-50 dark:bg-gray-900 shadow-md p-4"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {labelsDictionary[key as keyof typeof labelsDictionary] ||
                        key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {Array.from(values).map((value) => (
                      <Badge
                        key={value}
                        variant={
                          state.filters[key]?.includes(value)
                            ? "default"
                            : "outline"
                        }
                        className={cn(
                          "cursor-pointer transition",
                          state.filters[key]?.includes(value)
                            ? "bg-blue-500 text-white dark:bg-blue-600"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                        )}
                        onClick={() =>
                          state.filters[key]?.includes(value)
                            ? removeFilter(key, value)
                            : addFilter(key, value)
                        }
                      >
                        {value}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4")}
        >
          {!isLoading
            ? state.filteredVoices.map((voice: Voice, index: number) => {
                return (
                  <Card key={index} className="min-w-72">
                    <CardHeader>
                      <CardTitle>{voice.name}</CardTitle>
                      <CardDescription>{voice.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-1 flex-wrap p-1"></div>
                      <AudioPlayer
                        audioUrl={voice.preview_url}
                        text="Tocar prévia"
                      />
                    </CardContent>
                    <CardFooter>
                      <Button>Selecionar</Button>
                    </CardFooter>
                  </Card>
                );
              })
            : Array.from({ length: 17 }, (_, i) => {
                return (
                  <Card key={i} className="min-w-72">
                    <CardHeader>
                      <Skeleton className="h-4 w-[250px]" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-[250px]" />
                    </CardContent>
                    <CardFooter>
                      <Button>Selecionar</Button>
                    </CardFooter>
                  </Card>
                );
              })}
        </div>
      </div>
    </>
  );
}
