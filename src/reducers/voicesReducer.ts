import type { Voice } from "@/utils/types";

interface State {
  voices: Voice[];
  filteredVoices: Voice[];
  filters: Record<string, string[]>;
  labels: Set<string>;
}

interface Action {
  type: "SET_VOICES" | "ADD_FILTER" | "REMOVE_FILTER" | "CLEAR_FILTERS";
  payload?: any;
}

const initialState: State = {
  voices: [],
  filteredVoices: [],
  filters: {},
  labels: new Set<string>(),
};

function voicesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VOICES":
      return {
        ...state,
        voices: action.payload,
        filteredVoices: action.payload,
      };

    case "ADD_FILTER": {
      const { key, value } = action.payload;
      const newFilters = {
        ...state.filters,
        [key]: state.filters[key] ? [...state.filters[key], value] : [value],
      };
      const newLabels = new Set(state.labels).add(value);
      return {
        ...state,
        filters: newFilters,
        filteredVoices: applyFilters(state.voices, newFilters),
        labels: newLabels,
      };
    }

    case "REMOVE_FILTER": {
      const { key, value } = action.payload;
      const newFilters = {
        ...state.filters,
        [key]: state.filters[key].filter((item) => item !== value),
      };

      if (newFilters[key].length === 0) {
        delete newFilters[key];
      }

      const newLabels = new Set(state.labels);
      newLabels.delete(value);

      return {
        ...state,
        filters: newFilters,
        filteredVoices: applyFilters(state.voices, newFilters),
        labels: newLabels,
      };
    }

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {},
        filteredVoices: state.voices,
        labels: new Set<string>(),
      };

    default:
      return state;
  }
}

function applyFilters(
  voices: Voice[],
  filters: Record<string, string[]>,
): Voice[] {
  return voices.filter((voice) =>
    Object.keys(filters).every((key) =>
      filters[key].some((filterValue) => voice.labels[key] === filterValue),
    ),
  );
}

export { voicesReducer, initialState };
