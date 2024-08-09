import type { Voice } from "@/utils/types";

interface State {
  voices: Voice[];
  filteredVoices: Voice[];
  filters: { [key: string]: string[] };
}

interface Action {
  type: "SET_VOICES" | "ADD_FILTER" | "REMOVE_FILTER" | "CLEAR_FILTERS";
  payload?: any;
}

const initialState: State = {
  voices: [],
  filteredVoices: [],
  filters: {},
};

function voicesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VOICES":
      console.log("payload");
      console.log(action.payload);
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
      return {
        ...state,
        filters: newFilters,
        filteredVoices: applyFilters(state.voices, newFilters),
      };
    }
    case "REMOVE_FILTER": {
      const { key, value } = action.payload;
      const newFilters = {
        ...state.filters,
        [key]: state.filters[key].filter((item) => item !== value),
      };

      // Remove key if array is empty
      if (newFilters[key].length === 0) {
        delete newFilters[key];
      }

      return {
        ...state,
        filters: newFilters,
        filteredVoices: applyFilters(state.voices, newFilters),
      };
    }
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {},
        filteredVoices: state.voices,
      };
    default:
      return state;
  }
}

function applyFilters(
  voices: Voice[],
  filters: { [key: string]: string[] },
): Voice[] {
  return voices.filter((voice) => {
    return Object.keys(filters).every((key) =>
      filters[key].some((filterValue) => voice.labels[key] === filterValue),
    );
  });
}

export { voicesReducer, initialState };
