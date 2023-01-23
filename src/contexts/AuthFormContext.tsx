import {
  createContext,
  type PropsWithChildren,
  type Dispatch,
  useReducer,
  useContext,
} from "react";

type AuthFormState = "signup" | "login" | "closed";
type AuthFormAction = "openSignup" | "openLogin" | "close";

const authFormReducer = (
  state: AuthFormState,
  action: AuthFormAction
): AuthFormState => {
  if (action === "openSignup") return "signup";
  if (action === "openLogin") return "login";
  return "closed";
};

type AuthFormContextType = [AuthFormState, Dispatch<AuthFormAction>];

export const AuthFormContext = createContext<AuthFormContextType>([
  "closed",
  () => null,
]);

const AuthFormProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authFormReducer, "closed");

  return (
    <AuthFormContext.Provider value={[state, dispatch]}>
      {children}
    </AuthFormContext.Provider>
  );
};

export default AuthFormProvider;

export const useAuthFormContext = (): AuthFormContextType =>
  useContext(AuthFormContext);
