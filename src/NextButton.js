import { useQuiz } from "./context/QuizContext";

// index = { index };
function NextButton() {
  const { dispatch, answer, index, numQuestions } = useQuiz();
  if (answer == null) return null;
  console.log(numQuestions);
  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
  }
}

export default NextButton;
