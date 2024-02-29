import React from "react";
import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";
import { TRPCReactProvider } from "../src/trpc/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div id="app">
        <TRPCReactProvider>
          <Story />
        </TRPCReactProvider>
      </div>
    ),
  ],
};

export default preview;
