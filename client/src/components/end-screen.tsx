import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Bitcoin, Gift, Gamepad2, Fuel, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GiftType } from "@shared/schema";

interface EndScreenProps {
  finalBalance: number;
}

export function EndScreen({ finalBalance }: EndScreenProps) {
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedGift) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const giftAddress = selectedGift === "crypto" 
        ? `${address}${note ? ` | Note: ${note}` : ""}` 
        : `${email}${note ? ` | Note: ${note}` : ""}`;
      
      await apiRequest("POST", "/api/game-results", {
        playerName: "Dave",
        finalBalance,
        giftType: selectedGift,
        giftAddress,
        playerEmail: selectedGift !== "crypto" ? email : undefined
      });
      
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your gift choice has been recorded.",
      });
    } catch (error) {
      console.error("Failed to submit game result:", error);
      setSubmitError("Failed to submit your choice. Please try again.");
      toast({
        title: "Submission Failed",
        description: "There was an error saving your choice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const giftOptions: Array<{ type: GiftType; label: string; icon: any }> = [
    { type: "crypto", label: "Crypto transfer", icon: Bitcoin },
    { type: "amazon", label: "Amazon gift card", icon: Gift },
    { type: "playstation", label: "PlayStation gift card", icon: Gamepad2 },
    { type: "gas", label: "Gas card", icon: Fuel }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center">
            <Trophy className="w-20 h-20 md:w-24 md:h-24 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground" data-testid="text-complete">
            Challenge Complete!
          </h1>
          <div className="space-y-2">
            <p className="text-lg md:text-xl text-muted-foreground">Final balance</p>
            <p className="text-5xl md:text-7xl font-mono font-bold text-primary" data-testid="text-final-balance">
              {finalBalance}
            </p>
            <p className="text-base md:text-lg text-muted-foreground">crypto dollars</p>
          </div>
          <p className="text-lg md:text-xl text-foreground font-semibold max-w-md mx-auto" data-testid="text-real-gift">
            This is your real birthday gift amount in the real world
          </p>
        </div>

        {!isSubmitted ? (
          <Card className="border-card-border hover-elevate">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center" data-testid="text-choose">
                Choose your reward
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {giftOptions.map(({ type, label, icon: Icon }) => (
                  <Button
                    key={type}
                    variant={selectedGift === type ? "default" : "outline"}
                    onClick={() => setSelectedGift(type)}
                    className="h-16 text-lg justify-start gap-3"
                    data-testid={`button-gift-${type}`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Button>
                ))}
              </div>

              {selectedGift && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  {submitError && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive rounded-md">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      <p className="text-sm text-destructive">{submitError}</p>
                    </div>
                  )}
                  
                  {selectedGift === "crypto" ? (
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        placeholder="Enter your crypto wallet address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-11"
                        data-testid="input-wallet"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                        data-testid="input-email"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="note">Optional Note</Label>
                    <Textarea
                      id="note"
                      placeholder="Add any notes or preferences..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      data-testid="input-note"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={(selectedGift === "crypto" && !address) || (selectedGift !== "crypto" && !email) || isSubmitting}
                    size="lg"
                    className="w-full h-12 text-lg font-semibold"
                    data-testid="button-submit-choice"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Choice"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-500 border-2 shadow-lg shadow-green-500/20 animate-in zoom-in duration-500">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-confirmation">
                Got it!
              </h2>
              <p className="text-lg text-muted-foreground">
                {selectedGift === "crypto" 
                  ? `Crypto reward will be sent to your wallet address.`
                  : `Your ${giftOptions.find(g => g.type === selectedGift)?.label.toLowerCase()} choice has been recorded for your email.`
                }
              </p>
              {finalBalance > 0 && (
                <p className="text-xl font-semibold text-primary pt-4">
                  You've earned ${finalBalance}!
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
