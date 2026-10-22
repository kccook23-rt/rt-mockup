# CRT/RRT App – Mock-up

Live: https://kccook23-rt.github.io/rt-mockup/

Clickable design mock-up of the CRT/RRT exam-prep app. Not production code: the real app will be built in Flutter + Firebase, using this as the reference for look and behavior.

## Who works on what

| File | What it is | Owner |
|---|---|---|
| `js/app.js` | App shell, question pop-up, image viewer, settings, intro card, report-a-problem | Ken + Claude |
| `js/stats.js` | Stats page and "Build a practice set" | **Noelle** |
| `js/scales.js` | Scale reference cards (APGAR, GCS, GOLD, etc.). The info button appears only after the final answer. A question lists its cards in `infoScales`. | Ken + Claude |
| `js/progress.js` | Review list and per-question progress storage (used by both) | Shared: post in Discord before changing |
| `css/app.css` | Colors, fonts, layout | Shared: post in Discord before changing |
| `data/questions.json` | 20-question public sample, same fields as the Firebase question document | Ken + Claude |
| `images/` | Rhythm strips, ventilator graphics, capnogram | Ken + Claude |

Rules of thumb
- Edit only your own file when you can. For shared files, give the team a heads-up first.
- Every change saved to the `main` branch goes live at the link above in about a minute.
- **This project is public.** The full question bank is not here; it lives in the private `rt-question-bank` project.

## Running it on your computer
The page loads `data/questions.json`, so open it through a local web server instead of double-clicking `index.html`. For example, run `python3 -m http.server` in this folder and visit http://localhost:8000.

## After changing a CSS or JS file
In `index.html`, change the `?v=` number on the file links (for example `?v=20261022` → `?v=20261022b`) so everyone's browser loads the new version instead of an old saved copy.
