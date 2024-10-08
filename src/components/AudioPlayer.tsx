"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface IProps {
  audioUrl: string;
  text: string;
  playOnLoad?: boolean;
}

export default function AudioPlayer({
  audioUrl,
  text,
  playOnLoad = false,
}: IProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(playOnLoad);
  const { theme } = useTheme();

  useEffect(() => {
    const newAudio = new Audio(audioUrl);
    setAudio(newAudio);

    const handleEnded = () => setIsPlaying(false);
    newAudio.addEventListener("ended", handleEnded);

    if (playOnLoad) {
      setIsPlaying(true);
    }

    return () => {
      newAudio.removeEventListener("ended", handleEnded);
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [audioUrl, playOnLoad]);

  useEffect(() => {
    if (audio) {
      isPlaying ? audio.play() : audio.pause();
    }
  }, [isPlaying, audio]);

  const togglePlayback = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex gap-4 items-center">
      <Button
        variant="outline"
        size="icon"
        aria-label={isPlaying ? "Pausar" : "Tocar"}
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill={theme === "light" ? "#000" : "#fff"}
              d="M14 19h4V5h-4M6 19h4V5H6z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill={theme === "light" ? "#000" : "#fff"}
              d="M8 5.14v14l11-7z"
            />
          </svg>
        )}
      </Button>
      <p>{text}</p>
    </div>
  );
}
