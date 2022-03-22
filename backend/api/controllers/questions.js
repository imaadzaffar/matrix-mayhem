const mongoose = require("mongoose");
const { add, multiply, cross, det, inv } = require("mathjs");

const DIFF_ADDITION = 1;
const DIFF_MULTIPLICATION = 2;
const DIFF_DETERMINANT = 3;
const DIFF_INVERSE = 4;

const randomMatrix = (rows, cols, max) => [...new Array(rows)].map(() => randomArray(cols, max));

const randomArray = (length, max) => [...new Array(length)].map(() => Math.round(Math.random() * max));

const newQuestionAdd = () => {
  const m1 = randomMatrix(3, 3, 5);
  const m2 = randomMatrix(3, 3, 5);
  const ans = add(m1, m2);
  return { type: "addition", difficulty: DIFF_ADDITION, matrices: { m1: m1, m2: m2, ans: ans } };
};

const newQuestionMult = () => {
  const m1 = randomMatrix(3, 3, 5);
  const m2 = randomMatrix(3, 3, 5);
  const ans = multiply(m1, m2);
  return { type: "multiplication", difficulty: DIFF_MULTIPLICATION, matrices: { m1: m1, m2: m2, ans: ans } };
};

const newQuestionDet = () => {
  const m1 = randomMatrix(3, 3, 5);
  const ans = det(m1);
  return { type: "determinant", difficulty: DIFF_DETERMINANT, matrices: { m1: m1, ans: ans } };
};

const newQuestionInv = () => {
  const m1 = randomMatrix(3, 3, 5);
  const ans = inv(m1);
  return { type: "inverse", difficulty: DIFF_INVERSE, matrices: { m1: m1, ans: ans } };
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

exports.questions_get_new = (req, res, next) => {
  try {
    const question = getNewQuestion(req.params.type);
    res.status(200).json({
      message: "Generated new random question",
      question: question,
      request: {
        type: "GET",
        url: req.get("host") + "/questions",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
};
