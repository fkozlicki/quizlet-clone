"use client";

import type { Dispatch, PropsWithChildren } from "react";
import { createContext, useContext, useReducer } from "react";

import type { EditFolderSchema } from "@acme/validators";

interface FolderDialogState {
  open: boolean;
  defaultData?: typeof EditFolderSchema;
}

type FolderModalAction =
  | { type: "setDefaultData"; payload: FolderDialogState["defaultData"] }
  | { type: "open" }
  | { type: "close" };

const folderModalReducer = (
  state: FolderDialogState,
  action: FolderModalAction,
): FolderDialogState => {
  if (action.type === "setDefaultData")
    return {
      ...state,
      defaultData: action.payload,
    };
  if (action.type === "open")
    return {
      ...state,
      open: true,
    };
  if (action.type === "close")
    return {
      ...state,
      open: false,
    };
  return state;
};

const initialState: FolderDialogState = {
  open: false,
  defaultData: undefined,
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
