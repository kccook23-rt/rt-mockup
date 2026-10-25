/* Stats page: the practice builder. Owner: Noelle (reorganized with Ken + Claude, Oct 25).
   Uses shared globals from app.js (S, QS, ALL, ICON, esc, newRun) and progress.js (RL, ST, save, REASON_TXT).
   Flow, top to bottom: a one-line progress summary, then the builder (what to practice -> which sections ->
   more filters -> how many and which mode), then the review list. The Start button is always in reach.
   Add new buttons by giving them data-act="..." and handling them in STATS_ACTIONS below. */

let RL_ALL = false;
const COUNTS = ["5", "10", "25", "all"];
const DOM_NAMES = { RRT: { I: "Patient data", II: "Equipment and safety", III: "Interventions" } };
const domName = (d) => (QS.find((q) => q.domain === d && q.domName) || {}).domName || (DOM_NAMES[window.EXAM || "RRT"] || {})[d] || "";
const FORMATS = [["img", "With an image", (q) => !!q.img], ["data", "With a data list", (q) => q.rows.length > 0], ["card", "With a rule card", (q) => (q.scales || []).length > 0]];

function sourceOK(q) {
  const b = S.build;
  if (b.src === "review") return !!RL[q.id];
  if (b.src === "missed") return ST[q.id] && ST[q.id].lastCorrect === false;
  if (b.src === "new") return !ST[q.id];
  return true;
}
function filterOK(q, skip) {
  const b = S.build, any = (o) => Object.values(o || {}).some(Boolean);
  if (skip !== "secs" && any(b.secs) && !b.secs[q.sec]) return false;
  if (skip !== "fmt" && any(b.fmt) && !FORMATS.some(([k, , f]) => b.fmt[k] && f(q))) return false;
  if (skip !== "lvls" && any(b.lvls) && !b.lvls[q.lvl]) return false;
  if (skip !== "ages" && any(b.ages) && !b.ages[q.age.startsWith("Pediatric") ? "Pediatric" : q.age]) return false;
  return true;
}
function matching() { return ALL.filter((i) => sourceOK(QS[i]) && filterOK(QS[i])); }
function buildSet() {
  const m = matching();
  return S.build.count === "all" ? m : m.slice(0, Number(S.build.count));
}
function startLabel() {
  const m = matching().length, n = buildSet().length;
  return m ? `Start ${n} question${n === 1 ? "" : "s"}` : "No questions match";
}

function sectionRows() {
  const by = {};
  for (const q of QS) {
    const r = by[q.sec] || (by[q.sec] = { sec: q.sec, name: q.secName, dom: q.domain, total: 0, tried: 0, att: 0, cor: 0 });
    r.total++; const st = ST[q.id];
    if (st) { r.tried++; r.att += st.attempts; r.cor += st.correct; }
  }
  return Object.values(by).sort((a, b) => a.sec.localeCompare(b.sec, undefined, { numeric: true }));
}

function statsBody() {
  const b = S.build;
  const att = Object.values(ST).reduce((a, x) => a + x.attempts, 0), cor = Object.values(ST).reduce((a, x) => a + x.correct, 0);
  const tried = QS.filter((q) => ST[q.id]).length, pct = att ? Math.round(cor / att * 100) : 0;
  const rlIds = QS.filter((q) => RL[q.id]);
  const missed = QS.filter((q) => ST[q.id] && ST[q.id].lastCorrect === false).length;
  const rows = sectionRows(), scored = rows.filter((r) => r.att);
  const weak = scored.length > 1 ? scored.reduce((a, r) => (r.cor / r.att < a.cor / a.att ? r : a)) : null;
  const anySec = Object.values(b.secs).some(Boolean);
  const nSecs = Object.values(b.secs).filter(Boolean).length;
  const nMore = ["fmt", "lvls", "ages"].reduce((a, k) => a + Object.values(b[k] || {}).filter(Boolean).length, 0);
  const m = matching().length;

  const src = (v, label, count, hint) => `<button type="button" class="pick2" data-act="src" data-v="${v}" aria-pressed="${b.src === v}" ${count === 0 && v !== "all" ? "disabled" : ""}>
    <span class="dot" aria-hidden="true"></span><span><b>${label}</b><small>${hint}</small></span><em>${count}</em></button>`;
  const chip = (act, v, label, on, count) => `<button type="button" class="chip" data-act="${act}" data-v="${v}" aria-pressed="${!!on}">${label}${count !== undefined ? `<span class="n">${count}</span>` : ""}</button>`;
  const doms = [...new Set(rows.map((r) => r.dom))];
  const lvls = ["Recall", "Application", "Analysis"].filter((l) => QS.some((q) => q.lvl === l));
  const ages = ["Adult", "Pediatric", "Neonatal"].filter((a) => QS.some((q) => q.age.startsWith(a)));

  return `
    <div class="sthead"><h1 class="ph">Practice</h1>
      <p class="lede">${tried ? `You've tried ${tried} of ${QS.length} questions, ${pct}% correct${rlIds.length ? `, with ${rlIds.length} to revisit` : ""}.` : `${QS.length} questions are ready. Choose what you'd like to work on.`}</p></div>

    <section class="step"><h2>What to practice</h2>
      <div class="pick2s">
        ${src("all", "All questions", QS.length, "Everything in the bank")}
        ${src("new", "Not tried yet", QS.length - tried, "Questions you haven't seen")}
        ${src("review", "My review list", rlIds.length, "Missed or marked Not sure")}
        ${src("missed", "Missed last time", missed, "Your most recent wrong answers")}
      </div>
    </section>

    <section class="step"><div class="steph"><h2>Sections</h2>${anySec ? `<button type="button" class="link" data-act="secclear">Clear ${nSecs}</button>` : `<span class="hint">All sections</span>`}</div>
      <p class="hint">Tap sections to focus on them. Bars show your % correct.</p>
      ${doms.map((d) => {
        const rs = rows.filter((r) => r.dom === d), on = rs.filter((r) => b.secs[r.sec]).length;
        const da = rs.reduce((a, r) => a + r.att, 0), dc = rs.reduce((a, r) => a + r.cor, 0);
        return `<details class="dom" ${on || (weak && rs.includes(weak)) ? "open" : ""}><summary><span class="dname">${d}. ${esc(domName(d)) || "Domain " + d}</span>
            <span class="dmeta">${on ? `${on} selected` : `${rs.length} sections`}${da ? ` · ${Math.round(dc / da * 100)}%` : ""}</span></summary>
          <button type="button" class="link small" data-act="domall" data-v="${d}">${on === rs.length ? "Clear this domain" : "Select whole domain"}</button>
          ${rs.map((r) => { const p = r.att ? Math.round(r.cor / r.att * 100) : null; const sel = !!b.secs[r.sec]; return `<button type="button" class="secpick ${sel ? "on" : ""}" data-act="sec" data-v="${r.sec}" aria-pressed="${sel}">
            <span class="box" aria-hidden="true">${sel ? ICON.ok : ""}</span>
            <span class="stext"><b>${r.sec}${weak && weak.sec === r.sec ? ` <i class="weaktag">Weakest</i>` : ""}</b><small>${esc(r.name || "")}</small>
              <span class="sbar" aria-hidden="true"><i style="width:${p === null ? 0 : Math.max(4, p)}%"></i></span></span>
            <span class="sval">${p === null ? `<small>${r.total} q</small>` : `${p}%<small>${r.tried}/${r.total}</small>`}</span></button>`; }).join("")}
        </details>`; }).join("")}
    </section>

    <section class="step"><details class="more" ${nMore ? "open" : ""}><summary><h2>More filters</h2><span class="hint">${nMore ? `${nMore} on` : "Optional"}</span></summary>
      <fieldset><legend>Question type</legend><div class="chips">${FORMATS.map(([k, l, f]) => chip("fmt", k, l, b.fmt[k], QS.filter(f).length)).join("")}</div></fieldset>
      ${lvls.length > 1 ? `<fieldset><legend>Thinking level</legend><div class="chips">${lvls.map((l) => chip("lvl", l, l, b.lvls[l], QS.filter((q) => q.lvl === l).length)).join("")}</div></fieldset>` : ""}
      ${ages.length > 1 ? `<fieldset><legend>Patient</legend><div class="chips">${ages.map((a) => chip("age", a, a, b.ages[a], QS.filter((q) => q.age.startsWith(a)).length)).join("")}</div></fieldset>` : ""}
    </details></section>

    <section class="step"><h2>How many, and how</h2>
      <div class="chips">${COUNTS.map((v) => chip("count", v, v === "all" ? `All ${m}` : v, b.count === v)).join("")}</div>
      <div class="modes">
        <button type="button" class="mode2" data-act="bmode" data-v="study" aria-pressed="${b.mode === "study"}"><b>Study</b><small>See the answer and why after each question</small></button>
        <button type="button" class="mode2" data-act="bmode" data-v="exam" aria-pressed="${b.mode === "exam"}"><b>Exam</b><small>Timed, with answers at the end</small></button>
      </div>
      <p class="match" aria-live="polite">${m ? `${m} question${m === 1 ? " matches" : "s match"} your choices.` : "Nothing matches. Clear a filter or pick a different set."}</p>
    </section>

    <section class="step"><h2>Review list</h2>
      <p class="hint">Questions you missed or marked Not sure. Each one clears after two confident correct answers in a row.</p>
      ${rlIds.length ? `<ul class="rvlist">${(RL_ALL ? rlIds : rlIds.slice(0, 3)).map((q) => `<li><span class="info"><b>${q.id} · ${esc(q.topic)}</b>${REASON_TXT[RL[q.id].reason]} · ${RL[q.id].streak} of 2 toward clearing</span><button type="button" class="rm" data-act="rlrm" data-id="${q.id}" aria-label="Remove ${q.id} from review list">${ICON.x}</button></li>`).join("")}</ul>
        ${rlIds.length > 3 ? `<button type="button" class="link" data-act="rlall">${RL_ALL ? "Show fewer" : `Show all ${rlIds.length}`}</button>` : ""}`
        : `<p class="hint"><b>Nothing here yet.</b> Tap Not sure on any question you're unsure of, and missed questions land here too.</p>`}
    </section>
    <button type="button" class="link" data-act="resetstats">Reset my stats and review list (for testing)</button>`;
}

function statsPage() {   // plain layout (used where the Otter Bay frame isn't loaded)
  return `<div class="sheet"><div class="stats">${statsBody()}
    <div class="row"><button type="button" class="btn" data-act="buildstart" ${matching().length ? "" : "disabled"}>${startLabel()}</button></div>
    <div class="row"><button type="button" class="btn grey" data-act="backquiz">Back to questions</button></div></div></div>`;
}

const STATS_ACTIONS = {
  stats: () => { S.page = S.page === "stats" ? "quiz" : "stats"; S.view = null; },
  backquiz: () => { S.page = "quiz"; },
  src: (b) => { S.build.src = b.dataset.v; },
  sec: (b) => { const k = b.dataset.v; S.build.secs[k] = !S.build.secs[k]; },
  secclear: () => { S.build.secs = {}; },
  domall: (b) => { const rs = sectionRows().filter((r) => r.dom === b.dataset.v), all = rs.every((r) => S.build.secs[r.sec]); rs.forEach((r) => { S.build.secs[r.sec] = !all; }); },
  fmt: (b) => { const k = b.dataset.v; S.build.fmt[k] = !S.build.fmt[k]; },
  lvl: (b) => { const k = b.dataset.v; S.build.lvls[k] = !S.build.lvls[k]; },
  age: (b) => { const k = b.dataset.v; S.build.ages[k] = !S.build.ages[k]; },
  count: (b) => { S.build.count = b.dataset.v; },
  bmode: (b) => { S.build.mode = b.dataset.v; },
  buildstart: () => { const set = buildSet(); if (!set.length) return false; S.set = set; S.mode = S.build.mode; newRun(); S.page = "quiz"; },
  rlrm: (b) => { delete RL[b.dataset.id]; save("rtReviewList", RL); },
  rlall: () => { RL_ALL = !RL_ALL; },
  resetstats: () => { for (const k in RL) delete RL[k]; for (const k in ST) delete ST[k]; save("rtReviewList", RL); save("rtStats", ST); },
};
