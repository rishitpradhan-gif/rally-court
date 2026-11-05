export type Court = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  paddle: number;
  ai: number;
  score: number;
  lives: number;
  trail: { x: number; y: number }[];
};
export const fresh = (): Court => ({
  x: 400,
  y: 290,
  vx: 155,
  vy: 245,
  paddle: 400,
  ai: 400,
  score: 0,
  lives: 3,
  trail: [],
});
export function stepCourt(
  s: Court,
  elapsed: number,
  input: { left?: boolean; right?: boolean; speed?: number } = {},
) {
  if (s.lives <= 0) return;
  const dt = Math.max(0, Math.min(elapsed, 0.025)),
    difficulty = input.speed ?? 1;
  if (input.left) s.paddle -= 480 * dt;
  if (input.right) s.paddle += 480 * dt;
  s.paddle = Math.max(116, Math.min(684, s.paddle));
  s.ai += Math.max(-1, Math.min(1, (s.x - s.ai) / 70)) * 190 * difficulty * dt;
  s.ai = Math.max(116, Math.min(684, s.ai));
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  if (s.x < 73) {
    s.x = 73;
    s.vx = Math.abs(s.vx);
  }
  if (s.x > 727) {
    s.x = 727;
    s.vx = -Math.abs(s.vx);
  }
  if (s.vy > 0 && s.y >= 441 && s.y < 480 && Math.abs(s.x - s.paddle) < 61) {
    s.y = 440;
    s.score++;
    const speed = Math.min(510, 280 + s.score * 15) * difficulty,
      offset = (s.x - s.paddle) / 60;
    s.vx = offset * speed * 0.8;
    s.vy = -Math.sqrt(speed * speed - s.vx * s.vx);
  }
  if (s.vy < 0 && s.y <= 79 && s.y > 40 && Math.abs(s.x - s.ai) < 62) {
    s.y = 80;
    s.vx += (s.x - s.ai) * 2;
    s.vy = Math.abs(s.vy);
  }
  if (s.y < 20) {
    s.score += 3;
    s.x = 400;
    s.y = 100;
    s.vx = (s.score % 2 ? 1 : -1) * 100;
    s.vy = 260 * difficulty;
    s.trail = [];
  }
  if (s.y > 510) {
    s.lives--;
    s.trail = [];
    if (s.lives) {
      s.x = s.paddle;
      s.y = 300;
      s.vx = (s.lives % 2 ? 1 : -1) * 90;
      s.vy = 240 * difficulty;
    }
  }
  s.trail.push({ x: s.x, y: s.y });
  if (s.trail.length > 14) s.trail.shift();
}
