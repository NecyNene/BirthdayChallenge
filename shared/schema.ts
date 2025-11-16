import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameResults = pgTable("game_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerName: text("player_name").notNull(),
  finalBalance: integer("final_balance").notNull(),
  giftType: text("gift_type"),
  giftAddress: text("gift_address"),
  completedAt: timestamp("completed_at").defaultNow()
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({
  id: true,
  completedAt: true
});

export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type GameResult = typeof gameResults.$inferSelect;

export const giftTypeSchema = z.enum(["crypto", "amazon", "playstation", "gas"]);
export type GiftType = z.infer<typeof giftTypeSchema>;

export interface Question {
  id: number;
  text: string;
  correctAnswers: string[];
  multipleChoiceOptions: string[];
  textualHint: string;
}

export interface GameState {
  currentScreen: "welcome" | "game" | "end";
  currentQuestionIndex: number;
  balance: number;
  timeRemaining: number;
  hintsUsed: number;
  timeBoostUsed: boolean;
  easyHintUsed: boolean;
  selectedAnswer: string;
  showMultipleChoice: boolean;
  showFiftyFifty: boolean;
  multipleChoiceOptions: string[];
  transactionMessage: string;
  isAnswerCorrect: boolean | null;
}

export interface GiftSubmission {
  giftType: GiftType;
  address?: string;
  email?: string;
  note?: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 0,
    text: "Test question. Type the word READY to prove you are awake.",
    correctAnswers: ["ready"],
    multipleChoiceOptions: ["Ready", "Not ready", "Maybe"],
    textualHint: "Hint: It starts with R and ends with Y"
  },
  {
    id: 1,
    text: "In crypto, what is the general name for the place where you store your coins and tokens?",
    correctAnswers: ["wallet", "crypto wallet", "cryptowallet"],
    multipleChoiceOptions: ["Wallet", "Server", "Safe"],
    textualHint: "Reminder: Think about what you use to store physical money"
  },
  {
    id: 2,
    text: "In gaming, what is the common phrase for when your character becomes stronger and moves to the next stage of power?",
    correctAnswers: ["level up", "levelup", "leveling up", "levelled up", "leveling", "level-up"],
    multipleChoiceOptions: ["Level up", "Pause menu", "Game over"],
    textualHint: "Reminder: this word is used in gaming when your character becomes stronger"
  },
  {
    id: 3,
    text: "What is the everyday word for the part of a car that you use to slow down and stop?",
    correctAnswers: ["brakes", "brake"],
    multipleChoiceOptions: ["Brakes", "Transmission", "Headlights"],
    textualHint: "Hint: You press a pedal to activate this component"
  },
  {
    id: 4,
    text: "I get bigger the more you take away from me. What am I?",
    correctAnswers: ["hole", "a hole"],
    multipleChoiceOptions: ["A hole", "A tire", "A bag"],
    textualHint: "Reminder: Think about digging in the ground"
  },
  {
    id: 5,
    text: "In the anime Naruto, what is the name of the ninja village that Naruto is from?",
    correctAnswers: ["hidden leaf", "leaf village", "konohagakure", "the hidden leaf village", "konoha"],
    multipleChoiceOptions: ["Hidden Leaf", "Hidden Sand", "Hidden Mist"],
    textualHint: "Hint: It's related to a part of a tree"
  }
];

export const GAME_CONFIG = {
  STARTING_BALANCE: 100,
  STARTING_TIME: 40,
  HINT_COST: 3,
  EASY_HINT_COST: 2,
  TIME_BOOST_COST: 1,
  TIME_BOOST_SECONDS: 5,
  WRONG_ANSWER_PENALTY: 10,
  TIMEOUT_PENALTY: 10
};
