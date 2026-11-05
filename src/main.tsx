import { createRoot } from "react-dom/client";
import TennisGame from "./TennisGame";
import "./style.css";
function App() {
  return (
    <>
      <header className="lab-header">
        <a
          href="https://rishitpradhan.com"
          aria-label="Rishit Pradhan portfolio"
        >
          rp<span>•</span>
        </a>
        <a href="https://rishitpradhan.com">Rishit Pradhan ↗</a>
      </header>
      <main className="standalone-main">
        <span className="eyebrow">A SMALL GAME WITH A LITTLE BITE</span>
        <h1>Rally Court</h1>
        <p className="standalone-intro">Three lives. One more rally.</p>
        <div className="experiment-wrap">
          <TennisGame />
        </div>
        <p className="standalone-note">
          Move with your mouse, drag on touch, or use the arrow keys. Space
          pauses the game.
        </p>
      </main>
      <footer className="lab-footer">
        <span>Built by Rishit Pradhan</span>
        <a href="https://rishitpradhan.com/#offscreen">Portfolio context ↗</a>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
