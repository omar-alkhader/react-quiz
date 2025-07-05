// numQuestions = { numQuestions };
// i = { index };
// maxPossiblePoints = { maxPossiblePoints };
// points = { points };

import { useQuiz } from "./context/QuizContext";

// answer = { answer };
function Progress() {
  const { index, points, answer, maxPossiblePoints, numQuestions } = useQuiz();
  console.log(numQuestions);
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
