# DSA Visualizer

Interactive, reversible algorithm visualizer built with React + Vite. Each atomic algorithm step syncs the animated canvas with the exact code line, live variables, call stack, and metrics.

## Getting started

```bash
npm install
npm run dev   # start at http://localhost:5173
npm run build # production bundle
npm test -- --run
```

## Features

- Atomic step engine with deterministic forward/backward stepping, loop, speed (0.1x–3x), and keyboard shortcuts (Space, ←, →).
- SVG canvas for arrays, graphs, linked lists, stacks/queues, and binary trees; stateful highlighting and counters per step.
- Code viewer (JS + optional Python) with line highlighting tied to each step.
- Variable inspector with locals, metrics, and call stack depth.
- Export snapshot PNG and copyable permalink (encodes algorithm + input).
- Responsive grid layout; ARIA labels on controls; color-blind-friendly palette.

## Architecture

- `src/engine/VisualizerEngine.ts`: Core playback controller (`play/pause/stepForward/stepBackward/reset`, loop + speed) emitting `{step,index,state}`.
- `src/engine/types.ts`: Shared types for steps, visual state, and algorithm definitions.
- `src/algorithms/*`: Step generators (Bubble, Merge, Quick sort; BFS/DFS; linked list reverse; stack/queue; binary tree traversal). Each yields deterministic `AlgorithmStep` objects with `codeLine`, `description`, `vars`, `state`, and call stack snapshots where applicable.
- `src/components`: UI panels (LeftPanel inputs, Visualizer canvas, CodeViewer, ControlsBar, Inspector).
- `src/data`: Example datasets and canonical code snippets used for code highlighting.

## Adding a new algorithm

1. Create a generator that returns `{ steps, initial }` where `steps` is an ordered array of `AlgorithmStep`.
2. Each step should include a `state` snapshot sufficient to render the visualization and a `codeLine` matching your code snippet.
3. Add the definition to `src/algorithms/index.ts` with metadata, defaults, and code strings.
4. Wire any custom inputs via `LeftPanel` if needed.

## Keyboard & accessibility

- Space: Play/Pause
- →: Step forward
- ←: Step backward
- Loop toggle and speed slider live in the bottom control bar.
- All primary controls have ARIA labels; visualizer legend is announced via `aria-live`.

## Export & sharing

- `Snapshot PNG` saves the current SVG canvas to `visualizer.png`.
- `Copy Permalink` copies a URL embedding the current algorithm + input state (`?state=...`).

## Notes

- Default array size is capped at 50 for readability; you can increase (performance may degrade beyond ~200).
- Tests currently cover the VisualizerEngine sequencing and reverse behavior.
