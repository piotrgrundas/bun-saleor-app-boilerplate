import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@saleor/macaw-ui/style";

import { SaleorAppsProvider } from "@/lib/client/components/saleor-apps-provider";
import { AppView } from "./client/views/app/app-view";

const basePath = window.env?.BASE_PATH ?? "";

const router = createBrowserRouter(
  [
    {
      path: "/app",
      element: <AppView />,
    },
  ],
  {
    basename: `${basePath}/client`,
  },
);

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <SaleorAppsProvider>
        <RouterProvider router={router} />
      </SaleorAppsProvider>
    </StrictMode>,
  );
}
