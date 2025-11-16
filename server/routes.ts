import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameResultSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/game-results", async (req, res) => {
    try {
      const validatedData = insertGameResultSchema.parse(req.body);
      const result = await storage.createGameResult(validatedData);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/game-results", async (_req, res) => {
    try {
      const results = await storage.getGameResults();
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
