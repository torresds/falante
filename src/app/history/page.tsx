"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Link,
} from "@nextui-org/react";

import CenterWrapper from "@/components/CenterWrapper";
import ResponsiveForm from "@/components/ResponsiveForm";
import AudioPlayer from "@/components/AudioPlayer";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function HistoryPage() {
  const [localStorage, setLocal] = useLocalStorage(
    "history",
    [] as { generatedAt: string; url: string; content: string }[],
  );
  console.log(localStorage);
  return (
    <CenterWrapper>
      {localStorage?.length > 0 ? (
        <div className="flex gap-2 flex-wrap ">
          {localStorage.map((v, i) => {
            return (
              <>
                <Card className="w-50" key={i} radius="lg">
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-md font-bold">{v.content}</p>
                      <p className="text-xs">
                        Gerado em{" "}
                        {new Intl.DateTimeFormat("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(parseInt(v.generatedAt))}
                      </p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <AudioPlayer text="Tocar prévia" audioUrl={v.url} />
                  </CardBody>
                  <CardFooter>
                    <Button
                      as={Link}
                      color="primary"
                      download
                      className="w-full"
                      variant="solid"
                      target="_blank"
                      href={`${v.url}?download=1`}
                    >
                      Baixar áudio
                    </Button>
                  </CardFooter>
                </Card>
              </>
            );
          })}
        </div>
      ) : (
        <p>Nenhum áudio gerado ainda...</p>
      )}
    </CenterWrapper>
  );
}
