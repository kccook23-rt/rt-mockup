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

/* Stats content, in the order people use it: how am I doing -> where am I weakest -> what to revisit -> practice.
   statsBody() is shared: home.js wraps it in the Otter Bay page; statsPage() keeps the plain layout. */
let RL_ALL = false;
function sectionRows() {
  const by = {};
  for (const q of QS) {
    const r = by[q.sec] || (by[q.sec] = { sec: q.sec, total: 0, tried: 0, att: 0, cor: 0 });
    r.total++; const st = ST[q.id];
    if (st) { r.tried++; r.att += st.attempts; r.cor += st.correct; }
  }
  return Object.values(by).sort((a, b) => a.sec.localeCompare(b.sec, undefined, { numeric: true }));
}

function statsBody() {
  const att = Object.values(ST).reduce((a, x) => a + x.attempts, 0);
  const cor = Object.values(ST).reduce((a, x) => a + x.correct, 0);
  const tried = QS.filter((q) => ST[q.id]).length;
  const rlIds = QS.filter((q) => RL[q.id]);
  const secs = [...new Set(QS.map((q) => q.sec))];
  const n = buildSet().length;
  const rows = sectionRows();
  const scored = rows.filter((r) => r.att);
  const weak = scored.length > 1 ? scored.reduce((a, b) => (b.cor / b.att < a.cor / a.att ? b : a)) : null;
  const srcBtn = (v, label, count) => `<button type="button" class="chip" data-act="src" data-v="${v}" aria-pressed="${S.build.src === v}">${label}<span class="n">(${count})</span></button>`;
  const missed = QS.filter((q) => ST[q.id] && ST[q.id].lastCorrect === false).length;
  const pct = att ? Math.round(cor / att * 100) : 0;
  const shown = RL_ALL ? rlIds : rlIds.slice(0, 3);
  return `
    <div class="sthead"><h1 class="ph">Your progress</h1>
      <p class="lede">${tried ? `You've tried ${tried} of ${QS.length} questions and answered ${pct}% correctly.` : "Answer a few questions and your progress shows up here."}</p></div>
    <div class="tiles"><div><b>${tried}</b><span>questions tried</span></div><div><b>${pct}%</b><span>correct</span></div><div class="amber"><b>${rlIds.length}</b><span>to revisit</span></div></div>
    <div class="card"><h3>By section</h3>
      ${[...new Set(rows.map((r) => r.sec.split("-")[0]))].map((d) => {
        const rs = rows.filter((r) => r.sec.split("-")[0] === d);
        const da = rs.reduce((a, r) => a + r.att, 0), dc = rs.reduce((a, r) => a + r.cor, 0), dt = rs.reduce((a, r) => a + r.tried, 0), dn = rs.reduce((a, r) => a + r.total, 0);
        const dp = da ? Math.round(dc / da * 100) : null, hasWeak = weak && rs.some((r) => r.sec === weak.sec);
        return `<details class="dom" ${hasWeak ? "open" : ""}><summary class="secrow">
          <span class="sname">Domain ${d}</span><span class="sbar" aria-hidden="true"><i style="width:${dp === null ? 0 : Math.max(4, dp)}%"></i></span>
          <span class="sval">${dp === null ? "Not started" : dp + "%"}</span><span class="scount">${dt} of ${dn} tried · ${rs.length} sections</span></summary>
          ${rs.map((r) => { const p = r.att ? Math.round(r.cor / r.att * 100) : null; return `<div class="secrow sub ${weak && weak.sec === r.sec ? "weak" : ""}">
            <span class="sname">${r.sec}</span><span class="sbar" aria-hidden="true"><i style="width:${p === null ? 0 : Math.max(4, p)}%"></i></span>
            <span class="sval">${p === null ? "—" : p + "%"}</span><span class="scount">${r.tried} of ${r.total} tried</span></div>`; }).join("")}
        </details>`; }).join("")}
      ${weak ? `<p class="empty">Weakest so far: <b>${weak.sec}</b> at ${Math.round(weak.cor / weak.att * 100)}% correct.</p><button type="button" class="btn small" data-act="secpractice" data-v="${weak.sec}">Practice ${weak.sec}</button>` : ""}
    </div>
    <div class="card"><h3>Review list</h3>
      <p class="empty">Questions you missed or marked Not sure. Each one clears after two confident correct answers in a row.</p>
      ${rlIds.length ? `<ul class="rvlist">${shown.map((q) => `<li><span class="info"><b>${q.id} · ${esc(q.topic)}</b>${REASON_TXT[RL[q.id].reason]} · ${RL[q.id].streak} of 2 toward clearing</span><button type="button" class="rm" data-act="rlrm" data-id="${q.id}" aria-label="Remove ${q.id} from review list">${ICON.x}</button></li>`).join("")}</ul>
        ${rlIds.length > 3 ? `<button type="button" class="link" data-act="rlall">${RL_ALL ? "Show fewer" : `Show all ${rlIds.length}`}</button>` : ""}
        <button type="button" class="btn small" data-act="rlpractice">Practice my review list</button>`
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
    <button type="button" class="link" data-act="resetstats">Reset my stats and review list (for testing)</button>`;
}

function statsPage() {
  return `<div class="sheet"><div class="stats">${statsBody()}
    <div class="row"><button type="button" class="btn grey" data-act="backquiz">Back to questions</button></div></div></div>`;
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
  secpractice: (b) => { S.build = Object.assign(S.build, { src: "all", secs: { [b.dataset.v]: true }, count: "all" }); const set = buildSet(); if (!set.length) return false; S.set = set; S.mode = S.build.mode; newRun(); S.page = "quiz"; },
  rlpractice: () => { S.build = Object.assign(S.build, { src: "review", secs: {}, count: "all" }); const set = buildSet(); if (!set.length) return false; S.set = set; S.mode = S.build.mode; newRun(); S.page = "quiz"; },
  rlall: () => { RL_ALL = !RL_ALL; },
  resetstats: () => { for (const k in RL) delete RL[k]; for (const k in ST) delete ST[k]; save("rtReviewList", RL); save("rtStats", ST); },
};
