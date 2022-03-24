import { useEffect, useState } from "react";
import { checkAnswer, getNewQuestion } from "../services/questions";
import Question from "./Question";

export default function QuestionPage() {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState([]);

  const [answer, setAnswer] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [userInputs, setUserInputs] = useState([]);

  const [gameState, setGameState] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [difficulty, setDifficulty] = useState(1);

  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    newQuestion();
  }, []);

  async function newQuestion() {
    const data = await getNewQuestion(difficulty);
    console.log("question:", data.question);
    setQuestion(data.question);

    let ans = initAnswer(data.question);
    initUserAnswer(ans);

    setLoading(false);
  }

  function initAnswer(question) {
    for (const part of question.question) {
      if (part.type === "answer") {
        setAnswer(part.matrix);
        return part;
      }
    }
  }

  function initUserAnswer(ans) {
    const [rows, cols] = ans.dimensions;
    const zeroMatrix = [...Array(rows)].map((e) => Array(cols).fill(0));
    setUserAnswer(zeroMatrix);

    const emptyMatrix = [...Array(rows)].map((e) => Array(cols).fill(""));
    setUserInputs(emptyMatrix);
  }

  function updateUserAnswer(val, rows, cols) {
    const newAnswer = [...userAnswer];
    const newInputs = [...userInputs];
    newAnswer[rows][cols] = parseInt(val);
    newInputs[rows][cols] = val;
    setUserAnswer(newAnswer);
    setUserInputs(newInputs);
  }

  async function answerQuestion() {
    setAnswered(true);
    console.log("answered", answered);

    const data = await checkAnswer(answer, userAnswer);
    setCorrect(data.correct);
    updateGame(data.correct);
  }

  function updateGame(correct) {
    if (correct) {
      setScore(score + 100);

      // TODO: Animation for correct answer
    } else {
      setLives(lives - 1);

      // TODO: Animation for incorrect answer
    }
    adjustDifficulty(correct);
  }

  function adjustDifficulty(correct) {
    if (correct && difficulty < 4) {
      setDifficulty(difficulty + 1);
    } else if (!correct && difficulty > 1) {
      setDifficulty(difficulty - 1);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <h1>Question</h1>
        <Question question={question} inputs={userInputs} handleInput={updateUserAnswer}></Question>
        <p>Correct: {correct.toString()}</p>
        <p>Lives: {lives}</p>
        <p>Score: {score}</p>
        <button className="btn" onClick={answerQuestion}>
          Check
        </button>
        <button className="btn" onClick={newQuestion}>
          New Question
        </button>
      </>
    );
  }
}
