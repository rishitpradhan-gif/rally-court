import { fresh, stepCourt } from "./physics.ts";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
export default function TennisGame({ paused = false }: { paused?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null),
    world = useRef(fresh()),
    keys = useRef(new Set<string>()),
    visible = useRef(false),
    running = useRef(false),
    difficulty = useRef(1);
  const [status, setStatus] = useState<"ready" | "playing" | "paused" | "over">(
      "ready",
    ),
    [score, setScore] = useState(0),
    [lives, setLives] = useState(3),
    [best, setBest] = useState(0),
    [level, setLevel] = useState("Rally");
  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem("rp-tennis-best") || 0));
    } catch {}
  }, []);
  useEffect(() => {
    running.current = status === "playing" && !paused;
  }, [status, paused]);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    let frame = 0,
      last = 0;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      last = 0;
    });
    observer.observe(el);
    const blur = () => {
      keys.current.clear();
      if (running.current) setStatus("paused");
    };
    window.addEventListener("blur", blur);
    const hide = () => {
      if (document.hidden) blur();
    };
    document.addEventListener("visibilitychange", hide);
    function draw() {
      const s = world.current;
      ctx.fillStyle = "#075744";
      ctx.fillRect(0, 0, 800, 520);
      const glow = ctx.createRadialGradient(400, 260, 0, 400, 260, 550);
      glow.addColorStop(0, "#249d77");
      glow.addColorStop(1, "#064a3c");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 800, 520);
      ctx.strokeStyle = "#d8ebbc80";
      ctx.lineWidth = 2;
      ctx.strokeRect(64, 36, 672, 448);
      ctx.strokeRect(110, 36, 580, 448);
      ctx.strokeRect(110, 140, 580, 240);
      ctx.beginPath();
      ctx.moveTo(400, 140);
      ctx.lineTo(400, 380);
      ctx.stroke();
      ctx.strokeStyle = "#eff6df";
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(64, 260);
      ctx.lineTo(736, 260);
      ctx.stroke();
      ctx.setLineDash([]);
      s.trail.forEach((p, i) => {
        ctx.fillStyle = `rgba(222,247,128,${(i / s.trail.length) * 0.25})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + i * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });
      function racket(x: number, y: number, color: string) {
        ctx.fillStyle = "#022e29";
        ctx.beginPath();
        ctx.roundRect(x - 52, y + 5, 104, 13, 7);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - 52, y - 6, 104, 13, 7);
        ctx.fill();
        ctx.fillStyle = "#ffffff90";
        ctx.fillRect(x - 38, y - 4, 76, 2);
      }
      racket(s.ai, 64, "#f3a98c");
      racket(s.paddle, 456, "#e1f784");
      ctx.shadowColor = "#dafa79";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#e5fa80";
      ctx.beginPath();
      ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#608b3e";
      ctx.beginPath();
      ctx.arc(s.x - 3, s.y, 5, -1.3, 1.3);
      ctx.stroke();
    }
    function tick(now: number) {
      const dt = Math.min((now - last) / 1000 || 0, 0.025);
      last = now;
      if (visible.current && running.current) {
        const s = world.current;
        const beforeScore = s.score,
          beforeLives = s.lives;
        stepCourt(s, dt, {
          left: keys.current.has("ArrowLeft") || keys.current.has("a"),
          right: keys.current.has("ArrowRight") || keys.current.has("d"),
          speed: difficulty.current,
        });
        if (s.score !== beforeScore) setScore(s.score);
        if (s.lives !== beforeLives) setLives(s.lives);
        if (s.lives === 0) {
          running.current = false;
          setStatus("over");
          setBest((old) => {
            const value = Math.max(old, s.score);
            try {
              localStorage.setItem("rp-tennis-best", String(value));
            } catch {}
            return value;
          });
        }
      }
      if (visible.current) draw();
      frame = requestAnimationFrame(tick);
    }
    draw();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  function start() {
    if (status === "ready" || status === "over") {
      world.current = fresh();
      world.current.vy *= difficulty.current;
      setScore(0);
      setLives(3);
    }
    setStatus("playing");
    canvas.current?.focus();
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    world.current.paddle = Math.max(
      116,
      Math.min(684, ((e.clientX - r.left) / r.width) * 800),
    );
  }
  return (
    <div className="rally-game">
      <div className="game-scoreboard">
        <span>
          <small>RALLY</small>
          <strong>{String(score).padStart(2, "0")}</strong>
        </span>
        <span className="game-lives" aria-label={`${lives} lives remaining`}>
          {"●".repeat(lives)}
          <i>{"○".repeat(3 - lives)}</i>
        </span>
        <span>
          <small>BEST</small>
          <strong>{String(best).padStart(2, "0")}</strong>
        </span>
      </div>
      <div className="game-stage">
        <canvas
          ref={canvas}
          width={800}
          height={520}
          tabIndex={0}
          aria-label="Tennis court. Move with mouse, touch, or left and right arrow keys. Space pauses."
          onPointerMove={move}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e);
            e.currentTarget.focus();
          }}
          onKeyDown={(e) => {
            if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
              e.preventDefault();
              keys.current.add(e.key);
            }
            if (e.code === "Space") {
              e.preventDefault();
              if (status === "playing") setStatus("paused");
              else start();
            }
          }}
          onKeyUp={(e) => keys.current.delete(e.key)}
          onBlur={() => keys.current.clear()}
        />
        {(status !== "playing" || paused) && (
          <div className="game-overlay">
            <span className="micro">
              {status === "over" ? "Nice run. Again?" : "The five-minute court"}
            </span>
            <h4>
              {status === "over"
                ? `${score} points.`
                : status === "paused" || paused
                  ? "Catch your breath."
                  : "One more rally?"}
            </h4>
            <p>
              {status === "over"
                ? "Returns earn 1. Beat the opponent for 3."
                : "Keep the ball alive. Then put it past me."}
            </p>
            <button disabled={paused} onClick={start}>
              {status === "over" ? <RotateCcw size={15} /> : <Play size={15} />}{" "}
              {paused
                ? "Resume site motion to play"
                : status === "paused"
                  ? "Resume rally"
                  : status === "over"
                    ? "Play again"
                    : "Play tennis"}
            </button>
          </div>
        )}
      </div>
      <div className="game-toolbar">
        <label>
          Speed
          <select
            aria-label="Tennis difficulty"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              difficulty.current = e.target.value === "Rally" ? 1 : 1.35;
            }}
          >
            <option>Rally</option>
            <option>Match point</option>
          </select>
        </label>
        <span>Mouse / drag / ← →</span>
        <button
          onClick={() => (status === "playing" ? setStatus("paused") : start())}
          aria-label={status === "playing" ? "Pause tennis" : "Resume tennis"}
        >
          {status === "playing" ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {status === "over"
          ? `Game over. ${score} points.`
          : `${score} points. ${lives} lives.`}
      </p>
    </div>
  );
}
