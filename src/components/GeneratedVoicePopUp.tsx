"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import AudioPlayer from "./AudioPlayer";
import Link from "next/link";

interface GeneratedAudioProps {
  audioUrl: string;
  open: boolean;
  onClose?: () => void;
}

export function GeneratedAudioPopUp({
  audioUrl,
  open,
  onClose,
}: GeneratedAudioProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const AudioContent = (
    <>
      <AudioPlayer playOnLoad text="Prévia do áudio" audioUrl={audioUrl} />
      <Button variant="default" asChild className="w-full">
        <Link href={`${audioUrl}?download=1`} target="_blank">
          Baixar
        </Link>
      </Button>
    </>
  );

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Seu áudio foi gerado!</DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            {AudioContent}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Seu áudio foi gerado!</DrawerTitle>
          <DrawerDescription>
            Você pode baixar o áudio clicando no botão abaixo.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">{AudioContent}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
