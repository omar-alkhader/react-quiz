// question={questions.at(index)}
// dispatch={dispatch}

import { useQuiz } from "../context/QuizContext";

// answer={answer}
function QuestionOptions() {
  const { answer, dispatch, getQuestion } = useQuiz();
  const question = getQuestion();

  return (
    <div className="options">
      {question.options.map((option, i) => {
        const hasAnswer = answer == null;
        console.log(answer === question.correctOption);
        console.log(hasAnswer);
        return (
          <button
            className={`btn btn-option ${answer === i ? "answer" : ""} ${
              hasAnswer
                ? ""
                : i === question.correctOption
                ? " correct"
                : " wrong"
            }`}
            key={option}
            disabled={!hasAnswer}
            onClick={() => dispatch({ type: "newAnswer", payload: i })}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default QuestionOptions;
