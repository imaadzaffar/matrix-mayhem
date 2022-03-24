export default function MatrixDisplay({ matrix, dimensions }) {
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
            <div className="matrix-box" key={i * cols + j}>
              <div>{item}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
