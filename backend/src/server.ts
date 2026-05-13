import "dotenv/config";
import cors from "cors";
import express from "express";
import { alertRoutes } from "./routes/alertRoutes.js";
import { fxRoutes } from "./routes/fxRoutes.js";
import { statusRoutes } from "./routes/statusRoutes.js";
import { startAlertScheduler } from "./services/alertScheduler.js";
import { getSystemStatus } from "./services/statusService.js";
import { logger, requestLogger } from "./services/logger.js";

const app = express();
const port = Number(process.env.PORT ?? 7001);

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    ...getSystemStatus(),
  });
});

app.use("/fx", fxRoutes);
app.use("/alerts", alertRoutes);
app.use("/status", statusRoutes);

app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, `Reaisify API listening on http://0.0.0.0:${port}`);
});

startAlertScheduler();
