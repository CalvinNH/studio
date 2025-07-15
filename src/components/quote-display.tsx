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

  const fetchQuote = useCallback(async () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    try {
      const result = await generateMotivationalQuote({ topic: randomTopic });
      setCurrentQuote(result);
    } catch (error) {
      console.error("Failed to fetch motivational quote:", error);
      setCurrentQuote(fallbackQuote);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
    const intervalId = setInterval(fetchQuote, 5000);
    return () => clearInterval(intervalId);
  }, [fetchQuote]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  return (
    <div key={currentQuote?.quote} className="min-h-[6rem] animate-in fade-in duration-1000">
      <blockquote className="text-center">
        <p className="text-lg italic text-foreground md:text-xl">
          "{currentQuote?.quote}"
        </p>
        <footer className="mt-2 text-base text-muted-foreground">
          &mdash; {currentQuote?.author}
        </footer>
      </blockquote>
    </div>
  );
}
