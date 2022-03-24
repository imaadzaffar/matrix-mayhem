import Symbol from "./Symbol";
import MatrixDisplay from "./MatrixDisplay";
import MatrixAnswer from "./MatrixAnswer";

export default function Question({ question, inputs, handleInput }) {
  return (
    <div className="question">
      {question.question.map((part, index) => {
        switch (part.type) {
          case "symbol":
            return <Symbol symbol={part.symbol} key={index} />;
          case "matrix":
            return <MatrixDisplay matrix={part.matrix} dimensions={part.dimensions} key={index} />;
          case "answer":
            return (
              <MatrixAnswer
                matrix={part.matrix}
                dimensions={part.dimensions}
                inputs={inputs}
                handleInput={handleInput}
                key={index}
              />
            );
          default:
            return <div>Invalid question part type</div>;
        }
      })}
    </div>
  );
}
