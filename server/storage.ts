import { type GameResult, type InsertGameResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createGameResult(result: InsertGameResult): Promise<GameResult>;
  getGameResults(): Promise<GameResult[]>;
}

export class MemStorage implements IStorage {
  private gameResults: Map<string, GameResult>;

  constructor() {
    this.gameResults = new Map();
  }

  async createGameResult(insertResult: InsertGameResult): Promise<GameResult> {
    const id = randomUUID();
    const result: GameResult = { 
      ...insertResult, 
      id,
      completedAt: new Date()
    };
    this.gameResults.set(id, result);
    return result;
  }

  async getGameResults(): Promise<GameResult[]> {
    return Array.from(this.gameResults.values());
  }
}

export const storage = new MemStorage();
