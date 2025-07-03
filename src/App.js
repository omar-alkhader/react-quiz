import { useEffect, useReducer } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import QuestionOption from "./components/QuestionOptions";

import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
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
      return { ...state, questions: action.payload, status: "ready" };
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
export default function App() {
  const [{ questions, status, index, answer, points, highScore }, dispatch] =
    useReducer(reducer, initialState);
  const maxPossiblePoints = questions?.reduce(
    (pre, cur) => pre + cur.points,
    0
  );
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    fetchQuestions();
  }, []);
  function handleStartGame() {
    dispatch({ type: "startGame", payload: "active" });
  }
  const numQuestions = questions?.length || 0;
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} onClick={handleStartGame} />
        )}
        {status === "active" && questions?.at(index) && (
          <>
            <Progress
              numQuestions={numQuestions}
              i={index}
              maxPossiblePoints={maxPossiblePoints}
              points={points}
              answer={answer}
            />
            <Question>
              <h4>{questions.at(index).question}</h4>
              <QuestionOption
                question={questions.at(index)}
                dispatch={dispatch}
                answer={answer}
              />
            </Question>
            <Footer>
              <Timer dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numOfQuestion={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            highScore={highScore}
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
