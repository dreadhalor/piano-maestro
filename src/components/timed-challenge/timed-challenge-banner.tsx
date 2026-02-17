import { TimedChallengeScore } from "@/hooks/use-timed-challenge";

interface TimedChallengeBannerProps {
  timeRemaining: number;
  duration: number;
  score: TimedChallengeScore;
}

export const TimedChallengeBanner = ({
  timeRemaining,
  duration,
  score,
}: TimedChallengeBannerProps) => {
  const progress = duration > 0 ? (timeRemaining / duration) * 100 : 0;

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-gray-800 p-3 text-white">
      {/* Timer bar */}
      <div className="flex items-center gap-3">
        <span className="min-w-12 text-center text-lg font-bold tabular-nums">
          {timeRemaining}s
        </span>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-600">
          <div
            className="h-full rounded-full bg-green-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Live score */}
      <div className="flex justify-center gap-6 text-sm font-medium">
        <span className="text-green-400">
          Correct: {score.correct}
        </span>
        <span className="text-red-400">
          Incorrect: {score.incorrect}
        </span>
      </div>
    </div>
  );
};
