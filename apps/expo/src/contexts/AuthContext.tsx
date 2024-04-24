import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface AuthState {
  session: string | null;
}

const initialState: AuthState = {
  session: null,
};

const AuthContext = createContext<AuthState>(initialState);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthState["session"]>(null);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
