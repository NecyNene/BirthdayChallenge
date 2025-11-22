import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameResultSchema } from "@shared/schema";
import { sendGameResultsEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/game-results", async (req, res) => {
    try {
      const validatedData = insertGameResultSchema.parse(req.body);
      const result = await storage.createGameResult(validatedData);
      
      // Extract player email from giftAddress if available (format: "email | Note: ...")
      const playerEmail = req.body.playerEmail || (
        validatedData.giftAddress?.split(" | ")[0] || ""
      );
      
      // Send email notification asynchronously
      sendGameResultsEmail(
        result.playerName,
        result.finalBalance,
        result.giftType || "unknown",
        playerEmail || undefined
      ).catch(err => console.error("Email send error:", err));
      
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
