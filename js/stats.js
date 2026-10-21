/* Stats page and "Build a practice set". Owner: Noelle.
   Uses shared globals from app.js (S, QS, ALL, ICON, esc, newRun) and progress.js (RL, ST, save, REASON_TXT).
   Add new Stats-page buttons by giving them data-act="..." and handling them in STATS_ACTIONS below. */

function buildSet() {
  const b = S.build, anySec = Object.values(b.secs).some(Boolean);
  const picked = ALL.filter((i) => {
    const q = QS[i];
    if (anySec && !b.secs[q.sec]) return false;
    if (b.src === "review") return !!RL[q.id];
    if (b.src === "missed") return ST[q.id] && ST[q.id].lastCorrect === false;
    return true;
  });
  return b.count === "all" ? picked : picked.slice(0, Number(b.count));
}

function statsPage() {
  const att = Object.values(ST).reduce((a, x) => a + x.attempts, 0);
  const cor = Object.values(ST).reduce((a, x) => a + x.correct, 0);
  const rlIds = QS.filter((q) => RL[q.id]);
  const secs = [...new Set(QS.map((q) => q.sec))];
  const n = buildSet().length;
  const srcBtn = (v, label, count) => `<button type="button" class="chip" data-act="src" data-v="${v}" aria-pressed="${S.build.src === v}">${label}<span class="n">(${count})</span></button>`;
  const missed = QS.filter((q) => ST[q.id] && ST[q.id].lastCorrect === false).length;
  return `<div class="sheet"><div class="stats">
    <div><p class="eyebrow">Your progress</p><h2>Stats</h2></div>
    <div class="tiles"><div><b>${att}</b><span>answered</span></div><div><b>${att ? Math.round(cor / att * 100) : 0}%</b><span>correct</span></div><div class="amber"><b>${rlIds.length}</b><span>on review list</span></div></div>
    <div class="card"><h3>Review list</h3>
      <p class="empty">Questions you missed or marked Not sure. Each one clears after two confident correct answers in a row.</p>
      ${rlIds.length ? `<ul class="rvlist">${rlIds.map((q) => `<li><span class="info"><b>${q.id} · ${esc(q.topic)}</b>${REASON_TXT[RL[q.id].reason]} · ${RL[q.id].streak} of 2 toward clearing</span><button type="button" class="rm" data-act="rlrm" data-id="${q.id}" aria-label="Remove ${q.id} from review list">${ICON.x}</button></li>`).join("")}</ul>`
        : `<p class="empty"><b>Nothing here yet.</b> Answer some questions, and tap Not sure on any you're unsure of.</p>`}
    </div>
    <div class="card"><h3>Build a practice set</h3>
      <fieldset><legend>Questions from</legend><div class="chips">${srcBtn("all", "All questions", QS.length)}${srcBtn("review", "My review list", rlIds.length)}${srcBtn("missed", "Last answered wrong", missed)}</div></fieldset>
      <fieldset><legend>Sections <span style="font-weight:400;color:var(--muted)">(none selected = all)</span></legend><div class="chips">${secs.map((x) => `<button type="button" class="chip" data-act="sec" data-v="${x}" aria-pressed="${!!S.build.secs[x]}">${x}</button>`).join("")}</div></fieldset>
      <fieldset><legend>Number of questions</legend><div class="chips">${["5", "10", "all"].map((v) => `<button type="button" class="chip" data-act="count" data-v="${v}" aria-pressed="${S.build.count === v}">${v === "all" ? "All" : v}</button>`).join("")}</div></fieldset>
      <fieldset><legend>Mode</legend><div class="chips"><button type="button" class="chip" data-act="bmode" data-v="study" aria-pressed="${S.build.mode === "study"}">Study</button><button type="button" class="chip" data-act="bmode" data-v="exam" aria-pressed="${S.build.mode === "exam"}">Exam</button></div></fieldset>
      <p class="match" aria-live="polite">${n} question${n === 1 ? "" : "s"} match.</p>
      <button type="button" class="btn" data-act="buildstart" ${n ? "" : "disabled"}>Start practice set</button>
      <p class="empty" style="font-size:12px">Draft questions, under review. In the full app, filters also include topic, cognitive level, patient age, and questions with images.</p>
    </div>
    <div class="row"><button type="button" class="btn grey" data-act="backquiz">Back to questions</button></div>
    <button type="button" class="link" data-act="resetstats">Reset my stats and review list (for testing)</button>
  </div></div>`;
}

const STATS_ACTIONS = {
  stats: () => { S.page = S.page === "stats" ? "quiz" : "stats"; S.view = null; },
  backquiz: () => { S.page = "quiz"; },
  src: (b) => { S.build.src = b.dataset.v; },
  sec: (b) => { const k = b.dataset.v; S.build.secs[k] = !S.build.secs[k]; },
  count: (b) => { S.build.count = b.dataset.v; },
  bmode: (b) => { S.build.mode = b.dataset.v; },
  buildstart: () => { const set = buildSet(); if (!set.length) return false; S.set = set; S.mode = S.build.mode; newRun(); S.page = "quiz"; },
  rlrm: (b) => { delete RL[b.dataset.id]; save("rtReviewList", RL); },
  resetstats: () => { for (const k in RL) delete RL[k]; for (const k in ST) delete ST[k]; save("rtReviewList", RL); save("rtStats", ST); },
};
