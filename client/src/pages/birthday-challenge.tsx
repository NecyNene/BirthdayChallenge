import { useState, useCallback } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { GameScreen } from "@/components/game-screen";
import { EndScreen } from "@/components/end-screen";
import { GAME_CONFIG, QUESTIONS, type GameState } from "@shared/schema";

export default function BirthdayChallenge() {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: "welcome",
    currentQuestionIndex: 0,
    balance: GAME_CONFIG.STARTING_BALANCE,
    timeRemaining: GAME_CONFIG.STARTING_TIME,
    hintsUsed: 0,
    timeBoostUsed: false,
    easyHintUsed: false,
    selectedAnswer: "",
    showMultipleChoice: false,
    showFiftyFifty: false,
    multipleChoiceOptions: [],
    transactionMessage: "",
    isAnswerCorrect: null
  });

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: "game",
      currentQuestionIndex: 0,
      balance: GAME_CONFIG.STARTING_BALANCE,
      timeRemaining: GAME_CONFIG.STARTING_TIME,
      hintsUsed: 0,
      timeBoostUsed: false,
      easyHintUsed: false,
      selectedAnswer: "",
      showMultipleChoice: false,
      showFiftyFifty: false,
      multipleChoiceOptions: [],
      transactionMessage: "",
      isAnswerCorrect: null
    }));
  };

  const moveToNextQuestion = useCallback(() => {
    setGameState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      
      if (nextIndex >= QUESTIONS.length) {
        return { ...prev, currentScreen: "end" };
      }
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        timeRemaining: GAME_CONFIG.STARTING_TIME,
        hintsUsed: 0,
        timeBoostUsed: false,
        easyHintUsed: false,
        selectedAnswer: "",
        showMultipleChoice: false,
        showFiftyFifty: false,
        multipleChoiceOptions: [],
        transactionMessage: "",
        isAnswerCorrect: null
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {gameState.currentScreen === "welcome" && (
        <WelcomeScreen onStartGame={startGame} balance={gameState.balance} />
      )}
      {gameState.currentScreen === "game" && (
        <GameScreen 
          gameState={gameState} 
          setGameState={setGameState}
          onNextQuestion={moveToNextQuestion}
        />
      )}
      {gameState.currentScreen === "end" && (
        <EndScreen finalBalance={gameState.balance} />
      )}
    </div>
  );
}
