import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeScreenProps {
  onStartGame: () => void;
  balance: number;
}

export function WelcomeScreen({ onStartGame, balance }: WelcomeScreenProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
          <h1 
            className="text-5xl md:text-7xl font-bold animate-in slide-in-from-bottom-4 duration-1000 relative"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 900,
              letterSpacing: "0.02em",
              color: "#de8e5b",
              textShadow: `
                3px 3px 0px #1a1a1a,
                4px 4px 0px #2a2a2a,
                5px 5px 0px #3a3a3a,
                0 0 20px rgba(222, 142, 91, 0.5),
                0 0 40px rgba(222, 142, 91, 0.3)
              `,
              transform: "rotate(-2deg)",
              WebkitTextStroke: "2px rgba(0, 0, 0, 0.3)"
            }}
            data-testid="title-main"
          >
            Happy Birthday Dave
          </h1>
          <h2 
            className="text-2xl md:text-3xl text-muted-foreground font-medium animate-in slide-in-from-bottom-3 duration-1000 delay-300"
            data-testid="subtitle-challenge"
          >
            The Birthday Challenge
          </h2>
        </div>

        <div 
          className={`transition-all duration-700 ${
            showInstructions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Card className="border-card-border hover-elevate">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-4 text-base md:text-lg text-card-foreground leading-relaxed">
                <p className="text-xl md:text-2xl font-semibold text-foreground" data-testid="text-welcome">
                  Welcome to The Birthday Challenge.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You are starting with <span className="font-semibold text-primary">100 crypto dollars</span>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You will answer six questions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You can type your answer directly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You can pay to get hints.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Wrong answers cost you money.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="font-semibold text-foreground">Whatever is left at the end is your real birthday gift.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-semibold" data-testid="text-balance">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="text-primary font-mono text-2xl md:text-3xl">{balance}</span>
                  <span className="text-muted-foreground text-base">crypto dollars</span>
                </div>
                
                <Button 
                  size="lg"
                  className="w-full text-lg h-12 md:h-14 font-semibold"
                  onClick={onStartGame}
                  data-testid="button-start-game"
                >
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
