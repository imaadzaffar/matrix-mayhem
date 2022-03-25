import logo from "./logo.svg";
import phaserGame from "./phaser/PhaserGame";
import "./App.css";
import Question from "./components/QuestionPage";

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <Question />
      </div>
    </div>
  );
}

export default App;
