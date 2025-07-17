
"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Quote = {
  quote: string;
  author: string;
};

const quotes: Quote[] = [
    { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { quote: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
    { quote: "Ordinary people think merely of spending time, great people think of using it.", author: "Arthur Schopenhauer" },
    { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
    { quote: "The shorter the deadline, the more structured the work.", author: "A common saying" },
    { quote: "To-do lists are the backbone of any well-structured day.", author: "Unknown" },
    { quote: "For every minute spent organizing, an hour is earned.", author: "Benjamin Franklin" },
    { quote: "The bad news is time flies. The good news is you're the pilot.", author: "Michael Altshuler" },
    { quote: "You may delay, but time will not.", author: "Benjamin Franklin" },
    { quote: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
    { quote: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { quote: "Structure is what allows you to handle the chaos of life.", author: "Jordan Peterson" },
];

export function QuoteDisplay() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuote = useCallback(() => {
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchQuote();
    const intervalId = setInterval(fetchQuote, 5000); // Change quote every 5 seconds
    return () => clearInterval(intervalId);
  }, [fetchQuote]);

  if (isLoading || !currentQuote) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
        <Skeleton className="h-5 w-full max-w-lg" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg text-center transition-all duration-500 ease-in-out flex flex-col justify-center">
      <blockquote className="animate-in fade-in duration-1000">
        <p className="text-sm italic text-foreground/90">
          "{currentQuote.quote}"
        </p>
        <footer className="mt-2 text-xs text-muted-foreground">
          &mdash; {currentQuote.author}
        </footer>
      </blockquote>
    </div>
  );
}
