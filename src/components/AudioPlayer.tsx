"use client";

import { useState, useEffect } from "react";
import { Button, Progress } from "@nextui-org/react";

interface IProps {
  audioUrl: string;
  text: string;
}

export default function AudioPlayer(props: IProps) {
  const [audio] = useState(new Audio(props.audioUrl));
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDetails, setAudioDetails] = useState({
    audio: new Audio(props.audioUrl),
    isPlaying: false,
  });
  useEffect(() => {
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying]);

  const toggle = () => setIsPlaying(!isPlaying);
  useEffect(() => {
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  return (
    <div className="flex gap-4 items-center">
      <Button
        isIconOnly
        color="primary"
        aria-label="Tocar"
        onClick={() => toggle()}
      >
        {!isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path fill="#ffffff" d="M8 5.14v14l11-7z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path fill="#ffffff" d="M14 19h4V5h-4M6 19h4V5H6z" />
          </svg>
        )}
      </Button>
      <p>{props.text}</p>
    </div>
  );
}
