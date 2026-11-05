import { test } from "node:test";
import assert from "node:assert/strict";
import { fresh, stepCourt } from "../src/physics.ts";
test("a return reverses vertical velocity and scores exactly once", () => {
  const s = fresh();
  s.x = s.paddle;
  s.y = 440;
  s.vx = 0;
  s.vy = 250;
  stepCourt(s, 0.01);
  assert.equal(s.score, 1);
  assert.ok(s.vy < 0);
  stepCourt(s, 0.01);
  assert.equal(s.score, 1);
});
test("a side-wall hit reflects the ball into the court", () => {
  const s = fresh();
  s.x = 72;
  s.vx = -100;
  stepCourt(s, 0.01);
  assert.equal(s.x, 73);
  assert.ok(s.vx > 0);
});
test("a missed ball consumes one life and serves again", () => {
  const s = fresh();
  s.y = 511;
  stepCourt(s, 0.01);
  assert.equal(s.lives, 2);
  assert.equal(s.y, 300);
  assert.equal(s.score, 0);
});
test("a winner earns three points", () => {
  const s = fresh();
  s.y = 19;
  s.vy = -100;
  stepCourt(s, 0.01);
  assert.equal(s.score, 3);
  assert.ok(s.vy > 0);
});
test("game-over is terminal until reset", () => {
  const s = fresh();
  s.lives = 1;
  s.y = 511;
  stepCourt(s, 0.01);
  assert.equal(s.lives, 0);
  const frozen = { ...s };
  stepCourt(s, 10, { right: true });
  assert.deepEqual(s, frozen);
});
test("long frame gaps cannot teleport the player past the court", () => {
  const s = fresh();
  for (let i = 0; i < 200; i++) stepCourt(s, 100, { right: true });
  assert.equal(s.paddle, 684);
});
