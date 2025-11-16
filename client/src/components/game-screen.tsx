import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Lightbulb, Timer, Zap } from "lucide-react";
import { GAME_CONFIG, QUESTIONS, type GameState } from "@shared/schema";

declare global {
  interface Window {
    confetti: any;
  }
}

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNextQuestion: () => void;
}

export function GameScreen({ gameState, setGameState, onNextQuestion }: GameScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = QUESTIONS[gameState.currentQuestionIndex];

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (gameState.timeRemaining > 0 && !isProcessing && gameState.isAnswerCorrect === null) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsProcessing(true);
            
            timeoutRef.current = setTimeout(() => {
              onNextQuestion();
              setIsProcessing(false);
            }, 2500);
            
            return {
              ...prev,
              balance: Math.max(0, prev.balance - GAME_CONFIG.TIMEOUT_PENALTY),
              transactionMessage: `Time is up! Minus ${GAME_CONFIG.TIMEOUT_PENALTY}`,
              isAnswerCorrect: false,
              timeRemaining: 0
            };
          }
          
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.currentQuestionIndex, isProcessing, gameState.isAnswerCorrect, onNextQuestion]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    };
  }, []);

  const handleGetHint = () => {
    setGameState(prev => {
      if (prev.hintsUsed === 0) {
        return {
          ...prev,
          balance: Math.max(0, prev.balance - GAME_CONFIG.HINT_COST),
          hintsUsed: 1,
          showMultipleChoice: true,
          multipleChoiceOptions: currentQuestion.multipleChoiceOptions,
          transactionMessage: `Hint used. Minus ${GAME_CONFIG.HINT_COST}`
        };
      } else if (prev.hintsUsed === 1) {
        const fiftyFifty = currentQuestion.multipleChoiceOptions.slice(0, 2);
        return {
          ...prev,
          balance: Math.max(0, prev.balance - GAME_CONFIG.HINT_COST),
          hintsUsed: 2,
          showFiftyFifty: true,
          multipleChoiceOptions: fiftyFifty,
          transactionMessage: `Extra hint used. Minus ${GAME_CONFIG.HINT_COST}`
        };
      }
      return prev;
    });
  };

  const handleGetTime = () => {
    setGameState(prev => {
      if (prev.timeBoostUsed) return prev;
      
      return {
        ...prev,
        balance: Math.max(0, prev.balance - GAME_CONFIG.TIME_BOOST_COST),
        timeBoostUsed: true,
        timeRemaining: prev.timeRemaining + GAME_CONFIG.TIME_BOOST_SECONDS,
        transactionMessage: `Time boost! Minus ${GAME_CONFIG.TIME_BOOST_COST}`
      };
    });
  };

  const handleMakeEasier = () => {
    setGameState(prev => {
      if (prev.easyHintUsed) return prev;
      
      return {
        ...prev,
        balance: Math.max(0, prev.balance - GAME_CONFIG.EASY_HINT_COST),
        easyHintUsed: true,
        transactionMessage: `Textual hint revealed. Minus ${GAME_CONFIG.EASY_HINT_COST}`
      };
    });
  };

  const checkAnswer = (answer: string) => {
    const normalized = answer.toLowerCase().trim();
    return currentQuestion.correctAnswers.some(
      correctAnswer => correctAnswer.toLowerCase() === normalized
    );
  };

  const handleSubmit = () => {
    if (!gameState.selectedAnswer.trim() || isProcessing) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setIsProcessing(true);

    const isCorrect = checkAnswer(gameState.selectedAnswer);
    
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        isAnswerCorrect: true,
        transactionMessage: "Correct! No change"
      }));

      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#de8e5b', '#f5a962', '#ffffff', '#cccccc']
        });
      }

      submitTimeoutRef.current = setTimeout(() => {
        onNextQuestion();
        setIsProcessing(false);
      }, 2500);
    } else {
      setGameState(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance - GAME_CONFIG.WRONG_ANSWER_PENALTY),
        isAnswerCorrect: false,
        transactionMessage: `Incorrect. Minus ${GAME_CONFIG.WRONG_ANSWER_PENALTY}`
      }));

      submitTimeoutRef.current = setTimeout(() => {
        onNextQuestion();
        setIsProcessing(false);
      }, 2500);
    }
  };

  const handleMultipleChoiceClick = (option: string) => {
    setGameState(prev => ({ ...prev, selectedAnswer: option }));
    setTimeout(() => handleSubmit(), 100);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
          <div className="text-lg md:text-xl font-semibold text-muted-foreground" data-testid="text-title">
            The Birthday Challenge
          </div>
          <div className="text-lg md:text-xl font-semibold" data-testid="text-question-number">
            Question {gameState.currentQuestionIndex + 1} of {QUESTIONS.length}
          </div>
          <div className="flex items-center gap-2 text-lg md:text-xl font-semibold">
            <Clock className="w-5 h-5 text-primary" />
            <span 
              className={`font-mono ${gameState.timeRemaining <= 10 ? 'text-destructive' : 'text-foreground'}`}
              data-testid="text-timer"
            >
              {gameState.timeRemaining}s
            </span>
          </div>
        </div>

        <Card className={`border-2 transition-all duration-300 ${
          gameState.isAnswerCorrect === true 
            ? 'border-green-500 shadow-lg shadow-green-500/20' 
            : gameState.isAnswerCorrect === false 
            ? 'border-destructive shadow-lg shadow-destructive/20' 
            : 'border-card-border'
        }`}>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-muted-foreground">Balance:</span>
                <span 
                  className={`text-2xl md:text-3xl font-mono font-bold transition-colors duration-300 ${
                    gameState.isAnswerCorrect === true 
                      ? 'text-green-500' 
                      : gameState.isAnswerCorrect === false 
                      ? 'text-destructive' 
                      : 'text-primary'
                  }`}
                  data-testid="text-current-balance"
                >
                  {gameState.balance}
                </span>
              </div>
              {gameState.transactionMessage && (
                <Badge 
                  variant={gameState.isAnswerCorrect === true ? "default" : "destructive"}
                  className="text-sm px-3 py-1"
                  data-testid="badge-transaction"
                >
                  {gameState.transactionMessage}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed" data-testid="text-question">
                {currentQuestion.text}
              </div>

              {gameState.easyHintUsed && (
                <div className="p-4 bg-accent rounded-md border border-accent-border">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-accent-foreground" data-testid="text-hint">
                      {currentQuestion.textualHint}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Type your answer here..."
                  value={gameState.selectedAnswer}
                  onChange={(e) => setGameState(prev => ({ ...prev, selectedAnswer: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  disabled={isProcessing || gameState.isAnswerCorrect !== null}
                  className="text-lg h-12"
                  data-testid="input-answer"
                />

                {gameState.showMultipleChoice && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {gameState.multipleChoiceOptions.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        onClick={() => handleMultipleChoiceClick(option)}
                        disabled={isProcessing || gameState.isAnswerCorrect !== null}
                        className="h-12 text-base"
                        data-testid={`button-choice-${idx}`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!gameState.selectedAnswer.trim() || isProcessing || gameState.isAnswerCorrect !== null}
                size="lg"
                className="w-full h-12 text-lg font-semibold"
                data-testid="button-submit"
              >
                {isProcessing ? "Processing..." : "Submit Answer"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-border">
              <Button
                variant="secondary"
                onClick={handleGetHint}
                disabled={gameState.hintsUsed >= 2 || isProcessing || gameState.isAnswerCorrect !== null}
                className="h-10"
                data-testid="button-hint"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Need a hint ({gameState.hintsUsed}/2)
              </Button>
              <Button
                variant="secondary"
                onClick={handleGetTime}
                disabled={gameState.timeBoostUsed || isProcessing || gameState.isAnswerCorrect !== null}
                className="h-10"
                data-testid="button-time"
              >
                <Timer className="w-4 h-4 mr-2" />
                Give me more time
              </Button>
              <Button
                variant="secondary"
                onClick={handleMakeEasier}
                disabled={gameState.easyHintUsed || isProcessing || gameState.isAnswerCorrect !== null}
                className="h-10"
                data-testid="button-easier"
              >
                <Zap className="w-4 h-4 mr-2" />
                Make it easier
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameState.isAnswerCorrect === true && (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="text-3xl md:text-4xl font-bold text-green-500" data-testid="text-correct">
              🎉 Correct! Nice work! 🎉
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
