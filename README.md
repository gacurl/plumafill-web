# 🪶 PlumaFill (Web) — Hotwire Puzzle MVP

PlumaFill is a fill-in word puzzle app — think “crossword vibes, minus the clues.”
This repo is the **Hotwire MVP** used to prove the game loop is fun before any native SwiftUI port.

## Why Hotwire first?
Because proving the game is key.
Hotwire lets me iterate quickly on the puzzle loop (grid → input → validation → feedback) with low friction.

## Tech
- Ruby on Rails + Hotwire (Turbo + Stimulus)
- Tailwind CSS
- Postgres (later; MVP can start without DB)

## Local setup

### Run it
```bash
bundle install
bin/dev
```

## Local Access

Open:

- http://127.0.0.1:3000  
  *(recommended if your browser tries to force HTTPS)*

---

## Status

- ✅ **Milestone 0:** Repo boots clean
- ⏳ **Milestone 1:** Proof-of-fun demo grid

---

## Roadmap (Milestones)

- **Milestone 0:** Bootstrap + baseline
- **Milestone 1:** Proof-of-fun (single playable demo)
- **Milestone 2:** Puzzle model + slot logic
- **Milestone 3:** Puzzle library + saved progress
- **Milestone 4:** UX polish + accessibility
- **Milestone 5:** Deployable web app
- **Milestone 6:** Native decision + plan (SwiftUI) *or* PWA offline path

---

## Notes

This repo is the **truth engine** for puzzle mechanics.  
If/when the game loop is validated, the SwiftUI version becomes a port — not a guess.

---

## License

MIT

