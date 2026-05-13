import { Router } from "express";
import { getSystemStatus } from "../services/statusService.js";

export const statusRoutes = Router();

statusRoutes.get("/", (_request, response) => {
  response.json({
    data: getSystemStatus(),
  });
});
