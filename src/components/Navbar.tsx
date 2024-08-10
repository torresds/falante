"use client";

import { Button } from "@/components/ui/button";
import { AudioWaveform } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AudioWaveform className="text-blue-500 dark:text-blue-400" />
          <h1 className="font-bold text-2xl text-gray-800 dark:text-gray-200">
            Falante
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="link" asChild>
            <a
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Vozes
            </a>
          </Button>
          <Button variant="link" asChild>
            <a
              href="/history"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Histórico
            </a>
          </Button>
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}
