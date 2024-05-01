import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import Footer from "./Footer";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";

const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  limit: null,
  category: "linux",
  difficulty: "easy",
  answer: null,
  points: 0,
  highscore: 0,
  secRemaining: null,
};

const api_key = "Brk6bJm5KpM4Fz5w7Q8Fd5yQSUql9OSXe3wEFF4z";
const points_per_question = 10;
const sec_per_questions = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "categoryChange":
      return { ...state, category: action.payload };
    case "limitChange":
      return { ...state, limit: action.payload };
    case "difficultyChange":
      return { ...state, difficulty: action.payload };
    case "start":
      return {
        ...state,
        status: "active",
        secRemaining: state.questions.length * sec_per_questions,
      };

    case "newAnswer":
      const answerArr = Object.values(
        state.questions[state.index].correct_answers
      );
      const correctAnswer = answerArr.findIndex(checkAnswer);

      function checkAnswer(answer) {
        return answer === "true";
      }

      return {
        ...state,
        answer: action.payload,
        points:
          correctAnswer === action.payload
            ? state.points + points_per_question
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.highscore > state.points ? state.highscore : state.points,
      };
    case "tick":
      return {
        ...state,
        secRemaining: state.secRemaining - 1,
        status: state.secRemaining === 0 ? "finished" : state.status,
        highscore:
          state.secRemaining === 0
            ? state.highscore > state.points
              ? state.highscore
              : state.points
            : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [
    {
      questions,
      status,
      index,
      limit,
      category,
      difficulty,
      answer,
      points,
      highscore,
      secRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const totalPoints = numQuestions * points_per_question;

  useEffect(
    function () {
      async function getQuestions() {
        try {
          const res = await fetch(
            `https://quizapi.io/api/v1/questions?apiKey=${api_key}&limit=${limit}&category=${category}&difficulty=${difficulty}`
          );
          const data = await res.json();
          dispatch({ type: "dataReceived", payload: data });
        } catch (err) {
          console.error(err);
          dispatch({ type: "dataFailed" });
        }
      }

      getQuestions();
    },
    [limit, category, difficulty]
  );

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            category={`${category[0].toUpperCase()}${category.slice(1)}`}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer secRemaining={secRemaining} dispatch={dispatch} />
              <NextButton
                answer={answer}
                dispatch={dispatch}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
