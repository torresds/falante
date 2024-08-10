"use client";

import { languageNames } from "@/utils/languages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxResponsive } from "./Combobox";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";

const languageOptions = [...languageNames, "Padrão"].sort((a, b) =>
  a.localeCompare(b),
);

interface Props {
  multiLanguage?: boolean;
  selectedModel?: string;
  onVoiceGenerated: (voiceDetails: any) => any;
  selectedModelId?: string;
}

const schema = z.object({
  voiceModel: z.string().min(1, {
    message: "Selecione um modelo de voz.",
  }),
  content: z.string().min(1, {
    message: "Não é possível enviar um texto vazio.",
  }),
  language: z
    .string()
    .optional()
    .refine(
      (value) => {
        return !value || languageOptions.includes(value);
      },
      {
        message: "Linguagem inválida.",
      },
    ),
});

export function GenerateVoiceForm(props: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [localStorage, setLocal] = useLocalStorage(
    "history",
    [] as { generatedAt: string; url: string; content: string }[],
  );
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "Olá, mundo!",
      voiceModel: props.selectedModel || "",
    },
  });

  useEffect(() => {
    if (props.selectedModel) {
      form.setValue("voiceModel", props.selectedModel);
    }
  }, [props.selectedModel, form]);

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsGenerating(true);
    try {
      const body: { language?: string; text: string } = {
        text: values.content,
      };
      if (values.language && props.multiLanguage) {
        body["language"] = values.language;
      }
      const generatedVoice = await fetch(
        `api/audio/new/${props.selectedModelId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );
      const result = await generatedVoice.json();
      setLocal([
        ...localStorage,
        {
          generatedAt: Date.now().toString(),
          url: result.voice.url,
          content: values.content,
        },
      ]);
      props.onVoiceGenerated(result);
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4  border border-border m-4 max-w-full md:max-w-lg mx-auto rounded-xl shadow-lg bg-background text-foreground flex flex-col"
      >
        <FormField
          control={form.control}
          name="voiceModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo de voz: </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="border-input focus:border-primary focus:ring focus:ring-primary/40 rounded-lg bg-input text-input-foreground"
                  readOnly
                  {...field}
                />
              </FormControl>
              <FormDescription>Selecione um da lista abaixo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo do áudio: </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite o texto aqui..."
                  className="resize-none h-32 border-input focus:border-primary focus:ring focus:ring-primary/40 rounded-lg bg-input text-input-foreground"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Insira o texto que será convertido em áudio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idioma: </FormLabel>
              <FormControl>
                <ComboboxResponsive
                  {...field}
                  options={languageOptions}
                  placeholder="Padrão"
                  disabled={!props.multiLanguage}
                  onValueChange={(value) => form.setValue("language", value)}
                />
              </FormControl>
              <FormDescription>
                Escolha o idioma do texto. Nem todos os modelos suportam todos
                os idiomas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isGenerating ? (
          <Button type="submit" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando áudio...
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg shadow-md transition-all"
            disabled={!form.formState.isValid}
          >
            <Sparkles size="1rem" className="m-1" /> Gerar áudio
          </Button>
        )}
      </form>
    </Form>
  );
}
