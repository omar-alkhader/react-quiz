import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
const QuizContext = createContext();
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "startGame":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      let points = state.points;
      points += question.correctOption === action.payload ? question.points : 0;
      return { ...state, answer: action.payload, points };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        status: state.index === 14 ? "finished" : state.status,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore: Math.max(state.highScore, state.points),
      };
    case "reset": {
      return {
        ...initialState,
        highScore: state.highScore,
        questions: state.questions,
        status: "ready",
      };
    }
    default:
      throw new Error("no action type known");
  }
}
function QuizProvider({ children }) {
  const [{ questions, status, index, answer, points, highScore }, dispatch] =
    useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, q) => acc + q.points, 0);
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/questions");
      const data = await res.json();
      dispatch({ type: "dataReceived", payload: data });
    } catch (err) {
      dispatch({ type: "dataFailed" });
    }
  }, [dispatch]);

  function getQuestion() {
    return questions?.at(index);
  }
  return (
    <QuizContext.Provider
      value={{
        fetchQuestions,
        status,
        index,
        answer,
        points,
        getQuestion,
        maxPossiblePoints,
        numQuestions,
        highScore,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
function useQuiz() {
  const context = useContext(QuizContext);
  return context;
}
export { useQuiz, QuizProvider };
