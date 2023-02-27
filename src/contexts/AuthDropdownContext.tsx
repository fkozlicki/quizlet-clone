import {
  createContext,
  type PropsWithChildren,
  type Dispatch,
  useReducer,
  useContext,
} from "react";

type AuthDropdownState = "signup" | "login" | "closed";
type AuthDropdownAction = "openSignup" | "openLogin" | "close";

const authDropdownReducer = (
  state: AuthDropdownState,
  action: AuthDropdownAction
): AuthDropdownState => {
  if (action === "openSignup") return "signup";
  if (action === "openLogin") return "login";
  if (action === "close") return "closed";
  return "closed";
};

type AuthDropdownContext = [AuthDropdownState, Dispatch<AuthDropdownAction>];

export const AuthDropdownContext = createContext<AuthDropdownContext>([
  "closed",
  () => null,
]);

const AuthDropdownProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authDropdownReducer, "closed");

  return (
    <AuthDropdownContext.Provider value={[state, dispatch]}>
      {children}
    </AuthDropdownContext.Provider>
  );
};

export default AuthDropdownProvider;

export const useAuthDropdownContext = (): AuthDropdownContext =>
  useContext(AuthDropdownContext);
