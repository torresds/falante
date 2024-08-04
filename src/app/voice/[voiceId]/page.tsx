"use client";

import { useState } from "react";
import {
  Textarea,
  Button,
  Select,
  SelectSection,
  SelectItem,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link,
} from "@nextui-org/react";

import ResponsiveForm from "@/components/ResponsiveForm";
import { languages } from "@/utils/languages";
import CenterWrapper from "@/components/CenterWrapper";
import useSWR from "swr";
import ErrorModal from "@/components/ErrorModal";
import useLocalStorage from "@/hooks/useLocalStorage";
import AudioPlayer from "@/components/AudioPlayer";

export default function VoicePage({ params }: { params: { voiceId: string } }) {
  const [generatedVoice, setGeneratedVoice] = useState("");
  const { data, error } = useSWR(`/api/voices/${params.voiceId}`, (...args) =>
    fetch(...args).then(async (res) => {
      const jsonResult = await res.json();
      return jsonResult;
    }),
  );
  const [localStorage, setLocal] = useLocalStorage(
    "history",
    [] as { generatedAt: string; url: string; content: string }[],
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Portuguese");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/audio/new/${params.voiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language: selectedLanguage,
        }),
      });
      const responseDetails = await response.json();
      setIsGenerating(false);
      console.log(responseDetails);
      setLocal([
        ...localStorage,
        {
          generatedAt: Date.now().toString(),
          url: responseDetails.voice.url,
          content: text,
        },
      ]);
      setGeneratedVoice(responseDetails.voice.url);
    } catch (err) {}
  };

  return (
    <CenterWrapper>
      <Modal isOpen={generatedVoice != ""}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Seu aúdio foi gerado com sucesso!
              </ModalHeader>
              <ModalBody>
                <p>
                  Você pode ouvi-lo, baixa-lo ou acessar seu histórico de áudios
                  gerados, ou me fechar e continuar gerando áudios com esse
                  modelo.
                </p>
                <AudioPlayer text="Tocar áudio" audioUrl={generatedVoice} />
              </ModalBody>
              <ModalFooter>
                <Button color="default" as={Link} href="/history">
                  Histórico
                </Button>
                <Button as={Link} href={generatedVoice} color="primary">
                  Baixar aúdio gerado
                </Button>
                <Button color="default" onPress={() => setGeneratedVoice("")}>
                  Gerar outro áudio
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ErrorModal isOpen={!!error} />
      <ResponsiveForm border>
        <p className="font-bold">Detalhes da voz:</p>
        <Input
          isReadOnly
          type="text"
          label="Modelo de voz:"
          value={data?.name}
        />
        <Select label="Selecione seu idioma:">
          {languages.map((language) => {
            return <SelectItem key={language}>{language}</SelectItem>;
          })}
        </Select>

        <Textarea
          label="Texto a ser falado:"
          isRequired
          minRows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite o texto que deseja que seja falado"
        />
        <Button
          isLoading={isGenerating}
          onClick={generateAudio}
          isDisabled={data == null}
          color="primary"
        >
          Gerar áudio
        </Button>
      </ResponsiveForm>
    </CenterWrapper>
  );
}
