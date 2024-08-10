import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ComboboxResponsive } from "./Combobox";
import { Label } from "@/components/ui/label";
import { Switch } from "./ui/switch";
import { Filter, FilterX } from "lucide-react";

interface VoiceFilterProps {
  labels: Map<string, Set<string>>;
  labelsDictionary: Record<string, string>;
  onFilterChange: (filters: { label: string; value: string }[]) => void;
}

export const VoiceFilter: React.FC<VoiceFilterProps> = ({
  labels,
  labelsDictionary,
  onFilterChange,
}) => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>();
  const [appliedFilters, setAppliedFilters] = useState<
    { label: string; value: string }[]
  >([]);

  const addNewLabelValue = () => {
    if (!selectedLabel || newValue.trim() === "") return;
    if (!labels.get(selectedLabel)?.has(newValue)) return;

    const updatedFilters = [
      ...appliedFilters,
      { label: selectedLabel, value: newValue },
    ];
    setAppliedFilters(updatedFilters);
    onFilterChange(updatedFilters);
    setNewValue("");
  };

  const removeFilter = (label: string, value: string) => {
    const updatedFilters = appliedFilters.filter(
      (filter) => !(filter.label === label && filter.value === value),
    );
    setAppliedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setAppliedFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 my-4 items-center justify-center w-full">
        <div className="flex items-center gap-2">
          <Switch
            checked={isFiltering}
            onClick={() => setIsFiltering((prev) => !prev)}
            id="filters"
          />
          <Label htmlFor="filters">Filtrar modelos</Label>
        </div>
        {isFiltering && (
          <Button
            onClick={clearFilters}
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white"
          >
            <FilterX size="1.2rem" />
            Limpar filtros
          </Button>
        )}
      </div>

      {isFiltering && (
        <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <Select
                onValueChange={setSelectedLabel}
                value={selectedLabel || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tipo de filtro" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(labels.keys()).map((label) => (
                    <SelectItem key={label} value={label}>
                      {labelsDictionary[label] || label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2">
              <ComboboxResponsive
                disabled={!selectedLabel}
                options={
                  selectedLabel
                    ? Array.from(labels.get(selectedLabel) || [])
                    : []
                }
                onValueChange={setNewValue}
                value={newValue}
                placeholder="Digite ou selecione um valor"
              />
            </div>
            <Button onClick={addNewLabelValue}>
              <Filter size="1.2rem" />
              Adicionar
            </Button>
          </div>
        </div>
      )}

      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="font-semibold">Filtros aplicados:</span>
          {appliedFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-sm"
              onClick={() => removeFilter(filter.label, filter.value)}
            >
              {`${labelsDictionary[filter.label] || filter.label}: ${filter.value}`}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
