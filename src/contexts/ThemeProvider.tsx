import { ConfigProvider, theme } from "antd";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface ThemeContext {
  darkMode: boolean;
  switchDarkMode: () => void;
}

const initialState: ThemeContext = {
  darkMode: false,
  switchDarkMode: () => null,
};

const ThemeContext = createContext<ThemeContext>(initialState);

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const switchDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, switchDarkMode }}>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useThemeContext = (): ThemeContext => useContext(ThemeContext);
