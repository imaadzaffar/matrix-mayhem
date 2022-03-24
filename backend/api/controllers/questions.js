const mongoose = require("mongoose");
const { deepEqual, add, multiply, cross, det, inv } = require("mathjs");

const ROWS = 3;
const COLS = 3;
const COLS_MULT = 1;
const ROWS_DET = 1;
const COLS_DET = 1; 

// TODO add negative numbers too
const MAX = 5;
const MAX_ADDITION = 9;

const DIFF_ADDITION = 1;
const DIFF_MULTIPLICATION = 2;
const DIFF_DETERMINANT = 3;
const DIFF_INVERSE = 4;
// TODO const DIFF_UNKNOWN = 5;

const randomMatrix = (rows, cols, max) => [...new Array(rows)].map(() => randomArray(cols, max));

const randomArray = (length, max) => [...new Array(length)].map(() => Math.round(Math.random() * max));

const newQuestionAdd = () => {
  const m1 = randomMatrix(ROWS, COLS, MAX_ADDITION);
  const m2 = randomMatrix(ROWS, COLS, MAX_ADDITION);
  const ans = add(m1, m2);
  return {
    type: "addition",
    difficulty: DIFF_ADDITION,
    question: [
      { type: "matrix", matrix: m1, dimensions: [ROWS, COLS] },
      { type: "symbol", symbol: "+" },
      { type: "matrix", matrix: m2, dimensions: [ROWS, COLS] },
      { type: "symbol", symbol: "=" },
      { type: "answer", matrix: ans, dimensions: [ROWS, COLS] },
    ],
  };
};

const newQuestionMult = () => {
  const m1 = randomMatrix(3, 3, 5);
  const m2 = randomMatrix(3, 1, 5);
  const ans = multiply(m1, m2);
  return {
    type: "multiplication",
    difficulty: DIFF_MULTIPLICATION,
    question: [
      { type: "matrix", matrix: m1, dimensions: [ROWS, COLS] },
      { type: "symbol", symbol: "×" },
      { type: "matrix", matrix: m2, dimensions: [ROWS, COLS_MULT] },
      { type: "symbol", symbol: "=" },
      { type: "answer", matrix: ans, dimensions: [ROWS, COLS_MULT] },
    ],
  };
};

const newQuestionDet = () => {
  const m1 = randomMatrix(3, 3, 5);
  const ans = det(m1);
  return {
    type: "determinant",
    difficulty: DIFF_DETERMINANT,
    question: [
      { type: "symbol", symbol: "det" },
      { type: "matrix", matrix: m1, dimensions: [ROWS, COLS] },
      { type: "symbol", symbol: "=" },
      { type: "answer", matrix: [[ans]], dimensions: [ROWS_DET, COLS_DET] },
    ],
  };
};

const newQuestionInv = () => {
  const m1 = randomMatrix(3, 3, 5);
  const ans = randomMatrix(3, 1, 5);
  const m2 = multiply(m1, ans);
  return {
    type: "inverse",
    difficulty: DIFF_INVERSE,
    question: [
      { type: "matrix", matrix: m1, dimensions: [ROWS, COLS] },
      { type: "symbol", symbol: "×" },
      { type: "answer", matrix: ans, dimensions: [ROWS, COLS_MULT] },
      { type: "symbol", symbol: "=" },
      { type: "matrix", matrix: m2, dimensions: [ROWS, COLS_MULT] },
    ],
  };
};

const getNewQuestion = (difficulty) => {
  switch (Number(difficulty)) {
    case DIFF_ADDITION:
      return newQuestionAdd();
      break;
    case DIFF_MULTIPLICATION:
      return newQuestionMult();
      break;
    case DIFF_DETERMINANT:
      return newQuestionDet();
      break;
    case DIFF_INVERSE:
      return newQuestionInv();
      break;
    default:
      throw "Invalid question difficulty";
      break;
  }
};

exports.questionsGetNew = (req, res, next) => {
  try {
    const question = getNewQuestion(req.params.difficulty);
    res.status(200).json({
      message: "Generated new random question",
      question: question,
      request: {
        type: "GET",
        url: req.get("host") + "/questions/" + req.params.difficulty,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
};

exports.questionsCheckAnswer = (req, res, next) => {
  try {
    console.log(req.body.answer);
    console.log(req.body.userAnswer);

    const correct = deepEqual(req.body.answer, req.body.userAnswer);
    console.log(correct);
    res.status(200).json({
      message: "Checking the answer",
      correct: correct,
      request: {
        type: "POST",
        url: req.get("host") + "/questions/check",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
};
