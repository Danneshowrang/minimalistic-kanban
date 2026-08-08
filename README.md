# Kanbanlite

Minimalist kanban board. Create a board, get a shareable code, add tasks with tags, urgency, assignees, and subtasks.

## Run locally

npm install
npm run dev

## Build for production

npm run build

Output goes to `dist/`.

## Deploy

Deployed on Netlify. Base directory: `riverbed`, build command: `npm run build`, publish directory: `riverbed/dist`.

## Stack

- React + Vite
- React Router (HashRouter)
- localStorage for persistence — boards are local to the browser they were created in, not synced across devices

## Project structure

src/
  components/    Card.jsx, TaskModal.jsx
  pages/         Home.jsx, Board.jsx
  lib/           storage.js — all board/task persistence logic
  styles.css

## Known limitation

Board codes only work on the same browser/device that created them (no backend yet).
