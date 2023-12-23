import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";
import type { EditFolderValues } from "../schemas/folder";

type FolderModalState = {
  open: boolean;
  defaultData?: EditFolderValues;
};
type FolderModalAction =
  | { type: "setDefaultData"; payload: FolderModalState["defaultData"] }
  | { type: "open" }
  | { type: "close" };

const folderModalReducer = (
  state: FolderModalState,
  action: FolderModalAction
): FolderModalState => {
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

const initialState: FolderModalState = {
  open: false,
  defaultData: undefined,
};

type FolderModalContext = [FolderModalState, Dispatch<FolderModalAction>];

export const FolderModalContext = createContext<FolderModalContext>([
  initialState,
  () => null,
]);

const FolderModalProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(folderModalReducer, initialState);

  return (
    <FolderModalContext.Provider value={[state, dispatch]}>
      {children}
    </FolderModalContext.Provider>
  );
};

export default FolderModalProvider;

export const useFolderModalContext = (): FolderModalContext =>
  useContext(FolderModalContext);
