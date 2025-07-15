"use client";

import { useState, useEffect, useCallback } from "react";
import {
  generateMotivationalQuote,
  type MotivationalQuoteOutput,
} from "@/ai/flows/generate-motivational-quotes";
import { Skeleton } from "@/components/ui/skeleton";

const topics = ["time management", "focus", "structure"];
const fallbackQuote: MotivationalQuoteOutput = {
  quote: "The way to get started is to quit talking and begin doing.",
  author: "Walt Disney",
};

export function QuoteDisplay() {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [randomTopic, setRandomTopic] = useState("");

  useEffect(() => {
    // This effect runs only once on the client after hydration
    setRandomTopic(topics[Math.floor(Math.random() * topics.length)]);
  }, []);

  const fetchQuote = useCallback(async () => {
    if (!randomTopic) return;
    setIsLoading(true);
    try {
      const result = await generateMotivationalQuote({ topic: randomTopic });
      setCurrentQuote(result);
    } catch (error) {
      console.error("Failed to fetch motivational quote:", error);
      setCurrentQuote(fallbackQuote);
    } finally {
      setIsLoading(false);
    }
  }, [randomTopic]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  useEffect(() => {
    const intervalId = setInterval(() => {
        setRandomTopic(topics[Math.floor(Math.random() * topics.length)]);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-16 w-full flex-col items-center justify-center gap-2 text-center">
        <Skeleton className="h-5 w-full max-w-lg" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  return (
    <div key={currentQuote?.quote} className="h-16 animate-in fade-in duration-1000 w-full max-w-lg flex flex-col justify-center">
      <blockquote className="text-center">
        <p className="text-sm italic text-foreground md:text-base truncate">
          "{currentQuote?.quote}"
        </p>
        <footer className="mt-1 text-xs text-muted-foreground">
          &mdash; {currentQuote?.author}
        </footer>
      </blockquote>
    </div>
  );
}
