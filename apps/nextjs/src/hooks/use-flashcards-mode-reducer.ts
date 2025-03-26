"use client";

import { useReducer } from "react";

import type { RouterOutputs } from "@acme/api";

type Flashcards = RouterOutputs["studySet"]["byId"]["flashcards"];

export const flashcardsInitial = {
  flashcards: [] as Flashcards,
  index: 0,
  hard: [] as Flashcards,
  sorting: false,
  starredOnly: false,
  know: false,
};

type FlashcardsGameState = typeof flashcardsInitial;
type FlashcardsGameAction =
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "SHUFFLE" }
  | { type: "RESET"; payload: Flashcards }
  | { type: "MARK_HARD"; payload: Flashcards[number] }
  | { type: "MARK_KNOWN" }
  | { type: "REVIEW_HARD" }
  | { type: "TOGGLE_SORTING" }
  | { type: "TOGGLE_STARRED_ONLY" }
  | { type: "SET_FLASHCARDS"; payload: Flashcards };

export const flashcardsReducer = (
  state: FlashcardsGameState,
  action: FlashcardsGameAction,
): FlashcardsGameState => {
  if (action.type === "NEXT") {
    return { ...state, index: state.index + 1 };
  }
  if (action.type === "PREVIOUS") {
    return { ...state, index: state.index - 1 };
  }
  if (action.type === "TOGGLE_SORTING") {
    return { ...state, sorting: !state.sorting };
  }
  if (action.type === "MARK_KNOWN") {
    return { ...state, know: true };
  }
  if (action.type === "REVIEW_HARD") {
    return {
      ...state,
      flashcards: state.hard,
      hard: [],
      index: 0,
    };
  }
  if (action.type === "SHUFFLE") {
    return {
      ...state,
      flashcards: state.flashcards.sort(() => 0.5 - Math.random()),
    };
  }
  if (action.type === "MARK_HARD") {
    return {
      ...state,
      hard: [...state.hard, action.payload],
      know: false,
    };
  }
  if (action.type === "RESET") {
    const starredCards = action.payload.filter((card) => card.starred);
    return {
      ...flashcardsInitial,
      starredOnly: state.starredOnly,
      sorting: state.sorting,
      flashcards: state.starredOnly ? starredCards : action.payload,
    };
  }

  if (action.type === "SET_FLASHCARDS") {
    return { ...state, flashcards: action.payload };
  }

  const starredCards = state.flashcards.filter((card) => card.starred);

  return {
    ...state,
    starredOnly: !state.starredOnly,
    index: 0,
    flashcards: state.starredOnly ? flashcardsInitial.flashcards : starredCards,
  };
};

export const useFlashcardsModeReducer = (flashcards: Flashcards) =>
  useReducer(flashcardsReducer, { ...flashcardsInitial, flashcards });
