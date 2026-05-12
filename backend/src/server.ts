import "dotenv/config";
import cors from "cors";
import express from "express";
import { fxRoutes } from "./routes/fxRoutes.js";

const app = express();
const port = Number(process.env.PORT ?? 7001);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "currency-tracker-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/fx", fxRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Currency Tracker API listening on http://0.0.0.0:${port}`);
});
