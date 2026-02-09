import { Hono } from "hono";

import { saleorRoutes } from "./routes";
import { saleorWebhooks } from "./webhooks";

const saleorApi = new Hono();

saleorApi.route("/", saleorRoutes);
saleorApi.route("/webhooks", saleorWebhooks);

export { saleorApi };
