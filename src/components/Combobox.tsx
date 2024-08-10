import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Plus } from "lucide-react";

interface ComboboxProps {
  options: string[];
  onValueChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ComboboxResponsive({
  options,
  onValueChange,
  value = "",
  placeholder = "Selecione um dos dados...",
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedValue, setSelectedValue] = React.useState<string | null>(
    value,
  );

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={disabled} asChild>
          <Button variant="outline" className="w-auto justify-start">
            <Plus size="1rem" />
            {selectedValue ? <>{selectedValue}</> : <> {placeholder}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <OptionList
            options={options}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger disabled={disabled} asChild>
        <Button variant="outline" className="w-auto justify-start">
          {selectedValue ? <>{selectedValue}</> : <>+ {placeholder}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList
            options={options}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function OptionList({
  options,
  handleSelect,
}: {
  options: string[];
  selectedValue: string | null;
  handleSelect: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Adicionar..." className="w-auto" />
      <CommandList>
        <CommandEmpty>Não encontrado.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option}
              value={option}
              onSelect={(value) => handleSelect(value)}
            >
              {option}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
