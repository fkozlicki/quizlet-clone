import type { Preview } from "@storybook/react";
import React from "react";
import { TRPCReactProvider } from "../src/trpc/react";
import "@/styles/globals.css";
import "antd/dist/reset.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <TRPCReactProvider>
        <Story />
      </TRPCReactProvider>
    ),
  ],
};

export default preview;
