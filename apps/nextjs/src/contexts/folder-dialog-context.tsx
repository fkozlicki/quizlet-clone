"use client";

import type { Dispatch, PropsWithChildren } from "react";
import { createContext, useContext, useReducer } from "react";

interface FolderDialogState {
  open: boolean;
}

type FolderModalAction = { type: "open" } | { type: "close" };

const folderModalReducer = (
  state: FolderDialogState,
  action: FolderModalAction,
): FolderDialogState => {
  if (action.type === "open") {
    return {
      ...state,
      open: true,
    };
  }

  return {
    ...state,
    open: false,
  };
};

const initialState: FolderDialogState = {
  open: false,
};

type FolderDialogContext = [FolderDialogState, Dispatch<FolderModalAction>];

const FolderDialogContext = createContext<FolderDialogContext>([
  initialState,
  () => null,
]);

const FolderDialogProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(folderModalReducer, initialState);

  return (
    <FolderDialogContext.Provider value={[state, dispatch]}>
      {children}
    </FolderDialogContext.Provider>
  );
};

export default FolderDialogProvider;

export const useFolderDialogContext = (): FolderDialogContext =>
  useContext(FolderDialogContext);
