# Recallify

**Spaced Repetition Flashcard System** — A modern, Anki-inspired learning application with SM-2 scheduling, built entirely for the browser.

Manage flashcard decks, review cards on an optimal schedule, and track your learning progress — all with no server required.

## Features

- **Deck Management** — Create, rename, and delete flashcard decks
- **Smart Scheduling (SM-2)** — Simplified SM-2 algorithm adjusts intervals based on your performance
- **Review Sessions** — Flip-card interface with Again / Hard / Good / Easy ratings
- **Progress Dashboard** — View total cards, due cards, mastered cards, review streak, and study activity chart
- **Import / Export** — Export all decks as JSON and import them back
- **Local Persistence** — All data saved automatically to `localStorage`
- **Responsive Design** — Works seamlessly on desktop and mobile

## Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool and dev server
- **Recharts** — Study activity charts
- **date-fns** — Date manipulation
- **Zustand** — State management
- **localStorage** — Data persistence

## Getting Started

```bash
# Clone the repository
git clone https://github.com/codexfang/recallify.git
cd recallify

# Install dependencies
npm install

# Start development server
npm run dev
```

## Building for Production

```bash
npm run build
```

The static output is written to the `dist/` directory and can be served by any static file server.

## Deploying to GitHub Pages

```bash
npm run build

# Option A: Deploy using gh-pages
npx gh-pages -d dist

# Option B: Push the dist/ folder to the gh-pages branch manually
```

The app is configured with the correct `base` path (`/recallify/`) so it works when hosted at `https://codexfang.github.io/recallify/`.

## How SM-2 Works

Each card tracks:

- **Easiness Factor (EF)** — Adjusts based on how easy you found the card
- **Interval** — Days until the next review
- **Repetition** — Number of consecutive correct reviews
- **Next Review Date** — Date the card is due

Rating a card:

| Rating | Effect |
|--------|--------|
| Again | Reset to repeat immediately |
| Hard | Partial penalty to EF and interval |
| Good | Standard progression |
| Easy | Bonus to EF and interval |

## License

[MIT](./LICENSE)
