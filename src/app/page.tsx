import { PomodoroTimer } from "@/components/pomodoro-timer";
import { QuoteDisplay } from "@/components/quote-display";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <main className="flex w-full max-w-md flex-col items-center gap-8">
        <QuoteDisplay />
        <PomodoroTimer />
      </main>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>Built for Focus. Powered by You.</p>
      </footer>
    </div>
  );
}
