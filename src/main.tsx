import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { DHConnectProvider } from "@daohaus/connect";
import {
  HausThemeProvider,
  defaultDarkTheme,
  primaryDarkBtn,
  secondaryDarkBtn,
} from "@daohaus/ui";
import { Buffer } from "buffer";

import { Routes } from "./Routes";
import { TARGETS } from "./targetDao";
import { sand, sandA, sandDark, sandDarkA } from "@radix-ui/colors";
import { DefaultTheme } from "styled-components";

// This solves an issue when using WalletConnect and intercept Txs to create dao proposals
// Related open issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/748
window.Buffer = window.Buffer || Buffer;

const queryClient = new QueryClient();

const defaultBWTheme: DefaultTheme = {
  ...defaultDarkTheme,
  ...{
    themeName: "bw",
    transparent: "transparent",
    rootBgColor: sand.sand1,
    rootFontColor: sand.sand12,
    primary: sand as any,
    primaryA: sandA as any,
    secondary: sandDark as any,
    secondaryA: sandDarkA as any,
    link: {
      color: sand.sand12,
      active: {
        border: sand.sand12,
        color: sand.sand12,
      },
    },
    navigationMenu: {
      link: {
        color: sand.sand12,
        active: {
          color: sand.sand12,
        },

      },
    },
    button: {
      ...defaultDarkTheme.button,
      ...{
        primary: {
          ...primaryDarkBtn,
          ...{
            solid: {
              ...primaryDarkBtn.solid,
              ...{
                bg: sand.sand12,
                text: sand.sand1,
                border: sand.sand1,
                bgHover: sand.sand11,
                borderHover: sand.sand1,
              },
            },
          },
        },
      },
    },
  },
};

defaultDarkTheme;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <DHConnectProvider daoChainId={TARGETS.NETWORK_ID}>
          <HausThemeProvider themeOverrides={defaultBWTheme}>
            <Routes />
          </HausThemeProvider>
        </DHConnectProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);
