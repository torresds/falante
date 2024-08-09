"use client";

import { useReducer } from "react";
import useSWR from "swr";

const initialState = {
  searchTerm: "",
  speakingGender: "any",
  data: null,
  error: null,
};

const actionTypes = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_SPEAKING_GENDER: "SET_SPEAKING_GENDER",
  SET_DATA: "SET_DATA",
  SET_ERROR: "SET_ERROR",
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case actionTypes.SET_SPEAKING_GENDER:
      return { ...state, speakingGender: action.payload };
    case actionTypes.SET_DATA:
      return { ...state, data: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function useVoiceSearch() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data, error } = useSWR("/api/voices", async (...args) => {
    const res = await fetch(...args);
    const jsonResult = await res.json();
    for (const voice of jsonResult) {
      voice.labelsStr = Object.keys(voice.labels)
        .filter((label) => label !== "gender")
        .map((label) => voice.labels[label])
        .join(", ");
    }
    return jsonResult;
  });

  if (data && state.data !== data) {
    dispatch({ type: actionTypes.SET_DATA, payload: data });
  }

  if (error && state.error !== error) {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  }

  // Funções para atualizar searchTerm e speakingGender
  const setSearchTerm = (term) => {
    dispatch({ type: actionTypes.SET_SEARCH_TERM, payload: term });
  };

  const setSpeakingGender = (gender) => {
    dispatch({ type: actionTypes.SET_SPEAKING_GENDER, payload: gender });
  };

  return {
    searchTerm: state.searchTerm,
    speakingGender: state.speakingGender,
    data: state.data,
    error: state.error,
    setSearchTerm,
    setSpeakingGender,
  };
}
