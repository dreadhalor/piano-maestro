import { TimedChallengeScore } from "@/hooks/use-timed-challenge";
import { Button } from "@ui/button";

interface TimedChallengeResultsProps {
  score: TimedChallengeScore;
  onPlayAgain: () => void;
}

export const TimedChallengeResults = ({
  score,
  onPlayAgain,
}: TimedChallengeResultsProps) => {
  const total = score.correct + score.incorrect;
  const accuracy = total > 0 ? Math.round((score.correct / total) * 100) : 0;

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-gray-100 p-6 shadow-inner">
      <h3 className="text-2xl font-bold text-gray-800">Challenge Complete!</h3>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center">
        <div className="text-sm font-medium text-gray-500">Total</div>
        <div className="text-sm font-medium text-gray-500">Accuracy</div>
        <div className="text-3xl font-bold text-gray-800">{total}</div>
        <div className="text-3xl font-bold text-gray-800">{accuracy}%</div>
      </div>

      <div className="flex gap-6 text-lg font-semibold">
        <span className="text-green-600">{score.correct} correct</span>
        <span className="text-red-600">{score.incorrect} incorrect</span>
      </div>

      <Button onClick={onPlayAgain} className="mt-2">
        Play Again
      </Button>
    </div>
  );
};
