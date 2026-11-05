# Implementation notes

## Model

A successful return maps the ball’s horizontal offset from the paddle center to a new trajectory. Paddle and opponent movement are bounded to the court. A missed ball consumes one life; a zero-life state is terminal until the next game.

## Rendering and state

`src/physics.ts` owns the court state and collision rules. `src/TennisGame.tsx` draws the canvas and translates pointer or keyboard input. Physics advances using elapsed time capped at 25 ms to keep a resumed tab from teleporting the ball.

The interface uses ordinary React state for controls. High-frequency drawing uses refs or SVG updates rather than a server. Screenshots in this repository are actual app captures, not product mockups.

## Tradeoffs

A tennis-inspired paddle game, not a realistic tennis simulator. There is one local player and a simple AI opponent; no network multiplayer.

This project favors a small, inspectable implementation. The public portfolio demo and this standalone version share their origin, but this repo owns its extracted model and test suite. No customer data or product credentials are included.

## Checks

Return collision and single scoring, wall reflection, missed-ball life accounting, winners, terminal game-over, and long-frame movement bounds.
