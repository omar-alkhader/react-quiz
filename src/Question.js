import QuestionOptions from "./components/QuestionOptions";
import { useQuiz } from "./context/QuizContext";

function Question() {
  const { getQuestion } = useQuiz();

  return (
    <div>
      <h4>{getQuestion().question}</h4>
      <QuestionOptions />
    </div>
  );
}

export default Question;
