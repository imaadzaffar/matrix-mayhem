const apiUrl = "http://localhost:8080";

export async function getNewQuestion(difficulty) {
  const data = await fetch(`${apiUrl}/questions/${difficulty}`);
  return await data.json();
}

export async function checkAnswer(answer, userAnswer) {
  const data = await fetch(`${apiUrl}/questions/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answer: answer,
      userAnswer: userAnswer,
    }),
  });
  return await data.json();
}
