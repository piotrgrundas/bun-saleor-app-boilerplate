import { AppBridgeProvider, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { ThemeProvider } from "@saleor/macaw-ui";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

function ThemeSwitcher({ children }: PropsWithChildren) {
  const { appBridge } = useAppBridge();
  const [theme, setTheme] = useState<"defaultLight" | "defaultDark">("defaultLight");

  useEffect(() => {
    if (!appBridge) return;

    const unsubscribe = appBridge.subscribe("theme", (payload) => {
      setTheme(payload.theme === "dark" ? "defaultDark" : "defaultLight");
    });

    return () => {
      unsubscribe();
    };
  }, [appBridge]);

  return <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>;
}

function ReadyApp({ children }: PropsWithChildren) {
  const { appBridgeState } = useAppBridge();
  const isReady = appBridgeState?.ready ?? false;

  // Support standalone development mode (set SALEOR_UI_APP_TOKEN env var)
  const devToken = window.SALEOR_UI_APP_TOKEN;
  const isStandalone = !appBridgeState?.saleorApiUrl && devToken;

  if (!isReady && !isStandalone) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>Loading...</div>
    );
  }

  return <ThemeSwitcher>{children}</ThemeSwitcher>;
}

export function SaleorAppsProvider({ children }: PropsWithChildren) {
  return (
    <AppBridgeProvider>
      <ReadyApp>{children}</ReadyApp>
    </AppBridgeProvider>
  );
}
