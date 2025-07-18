"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Minus, Plus, Play, Pause, RefreshCcw } from "lucide-react";
import type { Synth } from "tone";

export function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [sessionCount, setSessionCount] = useState(4);

  const [currentSession, setCurrentSession] = useState(1);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);

  const synth = useRef<Synth | null>(null);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setIsFinished(false);
    setMode("work");
    setCurrentSession(1);
    setSecondsLeft(workMinutes * 60);
  }, [workMinutes]);

  useEffect(() => {
    if (isActive) return;
    if (mode === 'work') {
      setSecondsLeft(workMinutes * 60);
    } else {
      setSecondsLeft(breakMinutes * 60);
    }
  }, [workMinutes, breakMinutes, isActive, mode]);
  
  const initializeAudio = useCallback(async () => {
    if (!synth.current) {
      const { Synth: ToneSynth } = await import("tone");
      synth.current = new ToneSynth().toDestination();
    }
  }, []);

  const playSound = useCallback(() => {
    synth.current?.triggerAttackRelease("G5", "0.5");
  }, []);

  useEffect(() => {
    if (!isActive) return;

    if (secondsLeft <= 0) {
      playSound();
      
      if (mode === "work") {
        if (currentSession < sessionCount) {
          setMode("break");
          setSecondsLeft(breakMinutes * 60);
        } else {
          setIsFinished(true);
          setIsActive(false);
        }
      } else {
        setCurrentSession((prev) => prev + 1);
        setMode("work");
        setSecondsLeft(workMinutes * 60);
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode, currentSession, sessionCount, workMinutes, breakMinutes, playSound]);

  const handleSettingChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number, min: number, max: number) => {
    if (isActive) return;
    
    setter(prev => {
        const newValue = prev + value;
        // For sessionCount, ensure it doesn't go below the current session
        if (setter === setSessionCount) {
            const minAllowed = currentSession > 1 ? currentSession : min;
            return Math.max(minAllowed, Math.min(max, newValue));
        }
        return Math.max(min, Math.min(max, newValue));
    });
  };

  const handleStartPause = useCallback(async () => {
    await initializeAudio();
    if(isFinished) {
      handleReset();
      setIsActive(true);
    } else {
      setIsActive((prev) => !prev);
    }
  }, [isFinished, handleReset, initializeAudio]);
  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const SettingControl = ({ label, value, onDecrement, onIncrement, min, max }: { label: string, value: number, onDecrement: () => void, onIncrement: () => void, min: number, max: number }) => {
    const minAllowed = label === "Sessions" && currentSession > 1 ? currentSession : min;
    return (
        <div className="flex w-full items-center justify-between">
          <span className="text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onDecrement} disabled={isActive || value <= minAllowed}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-lg font-medium">{value}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onIncrement} disabled={isActive || value >= max}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
    );
  }
  
  const totalSeconds = (mode === 'work' ? workMinutes : breakMinutes) * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) : 0;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-lg font-medium text-muted-foreground">
          {isFinished ? "All sessions complete!" : `${mode === 'work' ? 'Work' : 'Break'} Session ${currentSession}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative flex h-48 w-48 items-center justify-center">
            <svg className="absolute h-full w-full" viewBox="0 0 80 80">
                <circle
                    className="stroke-muted"
                    cx="40"
                    cy="40"
                    r={radius}
                    strokeWidth="8"
                    fill="transparent"
                />
                <circle
                    className={cn("transition-stroke-dashoffset duration-1000 ease-linear", {
                        "stroke-primary": mode === 'work',
                        "stroke-accent": mode === 'break'
                    })}
                    cx="40"
                    cy="40"
                    r={radius}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 40 40)"
                    style={{ strokeLinecap: 'round' }}
                />
            </svg>
            <span className="text-5xl font-bold tracking-tighter text-foreground">
                {formatTime(secondsLeft)}
            </span>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: sessionCount }).map((_, index) => (
             <div
                key={index}
                title={`Session ${index + 1}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-300",
                  index < currentSession - 1 ? (mode === 'break' && index === currentSession - 2 ? "bg-accent" : "bg-primary") : "bg-muted",
                  index === currentSession - 1 && mode === 'break' && "bg-accent",
                  index === currentSession - 1 && isActive && mode === 'work' && "scale-125 bg-primary ring-2 ring-primary/50",
                )}
              />
          ))}
        </div>

        <div className="flex w-full items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full">
            <RefreshCcw className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            onClick={handleStartPause}
          >
            {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
          <div className="w-10 h-10"/>
        </div>

        <Separator />

        <div className="flex w-full flex-col gap-2">
          <SettingControl label="Work Duration" value={workMinutes} onDecrement={() => handleSettingChange(setWorkMinutes, -1, 1, 60)} onIncrement={() => handleSettingChange(setWorkMinutes, 1, 1, 60)} min={1} max={60} />
          <SettingControl label="Break Duration" value={breakMinutes} onDecrement={() => handleSettingChange(setBreakMinutes, -1, 1, 30)} onIncrement={() => handleSettingChange(setBreakMinutes, 1, 1, 30)} min={1} max={30} />
          <SettingControl label="Sessions" value={sessionCount} onDecrement={() => handleSettingChange(setSessionCount, -1, 1, 12)} onIncrement={() => handleSettingChange(setSessionCount, 1, 1, 12)} min={1} max={12} />
        </div>
      </CardContent>
    </Card>
  );
}
