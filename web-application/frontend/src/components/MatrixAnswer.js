export default function MatrixAnswer({ matrix, dimensions, inputs, handleInput }) {
  let [rows, cols] = dimensions;
  let gridStyles = {
    display: "grid",
    gridTemplateRows: `repeat(${rows}, 60px)`,
    gridTemplateColumns: `repeat(${cols}, 60px)`,
    gap: "5px",
  };

  return (
    <div style={gridStyles}>
      {matrix.map((row, i) =>
        row.map((item, j) => {
          return (
            <input
              type="number"
              className="matrix-box matrix-answer"
              value={inputs[i][j]}
              onChange={(e) => handleInput(e.target.value, i, j)}
              key={i * cols + j}
            ></input>
          );
        })
      )}
    </div>
  );
}
