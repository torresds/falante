"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Skeleton,
  Input,
  Select,
  SelectSection,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
} from "@nextui-org/react";
import useSWR from "swr";
import ResponsiveForm from "@/components/ResponsiveForm";
import CenterWrapper from "@/components/CenterWrapper";
import ErrorModal from "@/components/ErrorModal";
import AudioPlayer from "@/components/AudioPlayer";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [speakingGender, setSpeakingGender] = React.useState("any");

  const { data, error } = useSWR("/api/voices", (...args) =>
    fetch(...args).then(async (res) => {
      const jsonResult = await res.json();
      for (const voice of jsonResult) {
        voice.labelsStr = Object.keys(voice.labels)
          .filter((label) => label !== "gender")
          .map((label) => voice.labels[label])
          .join(", ");
      }
      console.log(jsonResult);
      return jsonResult;
    }),
  );
  const filteredData = data?.filter((voice: any) => {
    const includesNameAndTags =
      voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voice.labelsStr.toLowerCase().includes(searchTerm.toLowerCase());
    const onlyGenders =
      speakingGender === "any" || voice.labels.gender === speakingGender;
    return includesNameAndTags && onlyGenders;
  });
  const labelsDictionary = {};

  return (
    <>
      <ErrorModal
        isOpen={!!error}
        title="Erro ao obter lista de vozes"
        description="Algo deu errado ao se comunicar com o servidor da aplicação, clique
    no botão abaixo para tentar novamente."
      />
      <CenterWrapper>
        <div className=" flex flex-col items-center">
          <h1 className="text-4xl text-center mt-4">
            Escolha seu modelo de voz:
          </h1>
          <div className="flex gap-4 my-4 w-1/2">
            <Input
              fullWidth
              color="primary"
              size="lg"
              placeholder="Pesquise por nome, características..."
              value={searchTerm}
              className="text-xs"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              label="Gênero da voz"
              selectedKeys={[speakingGender]}
              onChange={(e) => {
                setSpeakingGender(e.target.value);
              }}
            >
              <SelectItem key="male">Masculino</SelectItem>
              <SelectItem key="female">Feminino</SelectItem>
              <SelectItem key="any">Qualquer um</SelectItem>
            </Select>
            <Button
              as={Link}
              href="/history"
              size="lg"
              color="primary"
              variant="faded"
            >
              Histórico
            </Button>
            <ThemeSwitcher />
          </div>
          <div className="md:grid flex flex-col md:grid-cols-3 gap-4 p-4 ">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((voice: any) => (
                <Card className="w-50" key={voice.id} radius="lg">
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-md font-bold">{voice.name}</p>
                      <p className="text-xs">{voice.category}</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <p className="p-2 text-1xl font-bold">Características:</p>
                  <div className="flex flex-1 gap-1 p-2">
                    {Object.keys(voice.labels).map(
                      (label: any) =>
                        (label as string) !== "gender" && (
                          <Chip radius="sm" key={label}>
                            {voice.labels[label]}
                          </Chip>
                        ),
                    )}
                  </div>

                  <Divider />
                  <CardBody>
                    <AudioPlayer
                      text="Tocar prévia"
                      audioUrl={voice.preview_url}
                    />
                  </CardBody>
                  <CardFooter>
                    <Button
                      as={Link}
                      color="primary"
                      className="w-full"
                      variant="solid"
                      href={`/voice/${voice.voice_id}`}
                    >
                      Selecionar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : data ? (
              <p>Nenhum resultado encontrado</p>
            ) : (
              Array.from({ length: 17 }, (_, i) => (
                <Card className="w-max" key={i} radius="lg">
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <Skeleton className="w-3/5 rounded-lg">
                      <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </CardBody>
                  <CardFooter>
                    <Button color="primary">Carregando...</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </CenterWrapper>
    </>
  );
}
