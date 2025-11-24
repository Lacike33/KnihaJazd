"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  open: boolean;
  onStart: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ open, onStart, onSkip }: WelcomeScreenProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-2xl">
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Vitaj v Knihe jázd</h2>
            <p className="text-lg text-muted-foreground max-w-md">Poďme to nastaviť tak, aby si mala výkaz pre DPH bez nervov</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full mt-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <BookOpen className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-center">Zákonná kniha jázd</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Sparkles className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-center">AI autogenerovanie</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Zap className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-center">DPH výkazy</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-4">
            <Button size="lg" className="w-full" onClick={onStart}>
              Rýchly štart (5-10 min)
            </Button>
            <Button variant="ghost" className="w-full" onClick={onSkip}>
              Preskočiť, ukáž mi len appku
            </Button>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pokrok</span>
              <span>0/6 krokov</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>

          <p className="text-xs text-muted-foreground text-center">Môžeš sa k tutoriálu kedykoľvek vrátiť v menu Pomocník</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
