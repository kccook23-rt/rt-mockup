/* Home and Products pages (Otter Bay theme). Owner: Ken + Claude.
   Adds pages to app.js through window.PAGES / window.PAGE_ACTIONS. Uses globals from app.js (S, QS, ALL, newRun, render)
   and progress.js (RL, ST, load, save). Each exam site sets window.EXAM ("RRT", "SDS") and window.EXAM_LINKS. */
(function () {
  const EXAMS = [
    { key: "RRT", name: "CRT/RRT", sub: "Respiratory therapy", href: (window.EXAM_LINKS || {}).RRT },
    { key: "SDS", name: "SDS", sub: "Sleep disorders specialist", href: (window.EXAM_LINKS || {}).SDS },
    { key: "RPSGT", name: "RPSGT", sub: "Sleep technologist", href: null, soon: true },
  ];
  const DAY = (d) => d.toISOString().slice(0, 10);
  const LOG = load("dayLog", {});                       // { "2026-10-25": answered count }

  // Count answers per day for the tide chart, without changing progress.js.
  const rec = window.recordAnswer;
  window.recordAnswer = function (q, c) { rec(q, c); const k = DAY(new Date()); LOG[k] = (LOG[k] || 0) + 1; save("dayLog", LOG); };

  const greet = () => { const h = new Date().getHours(); return h < 5 ? "Up late?" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

  const OTTER = `<svg class="otter" viewBox="0 0 320 150" aria-hidden="true">
    <ellipse cx="160" cy="98" rx="118" ry="30" fill="#7A4E2D"/>
    <path d="M44 96c-22-4-36 4-40 14 14 2 30 0 44-6z" fill="#6A4227"/>
    <ellipse cx="160" cy="92" rx="88" ry="20" fill="#B98A5E"/>
    <ellipse cx="248" cy="80" rx="34" ry="30" fill="#7A4E2D"/>
    <ellipse cx="258" cy="86" rx="22" ry="17" fill="#E9D2B0"/>
    <circle cx="232" cy="56" r="8" fill="#6A4227"/><circle cx="268" cy="54" r="8" fill="#6A4227"/>
    <path d="M244 76q5 4 10 0M262 74q5 4 10 0" stroke="#2A1A0E" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="264" cy="88" rx="6" ry="4.5" fill="#2A1A0E"/>
    <path d="M264 92q0 6-6 7M264 92q0 6 6 7" stroke="#2A1A0E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M276 90l22-4M276 94l22 2M252 90l-22-4M252 94l-22 2" stroke="#F5ECDD" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;
  const PAWS = `<svg class="paws" viewBox="0 0 90 40" aria-hidden="true"><ellipse cx="24" cy="22" rx="16" ry="10" fill="#6A4227" transform="rotate(-20 24 22)"/><ellipse cx="62" cy="20" rx="16" ry="10" fill="#6A4227" transform="rotate(15 62 20)"/><path d="M14 18l3 4M20 15l2 5M27 14l1 5M58 13l-1 5M65 14l-2 5M71 17l-3 4" stroke="#4E2F1A" stroke-width="2" stroke-linecap="round"/></svg>`;

  function weekBars() {
    const out = [], now = new Date();
    for (let k = 6; k >= 0; k--) { const d = new Date(now); d.setDate(now.getDate() - k); out.push({ d, n: LOG[DAY(d)] || 0 }); }
    const max = Math.max(5, ...out.map((x) => x.n));
    return `<div class="tide" role="img" aria-label="Questions answered each day this week: ${out.map((x) => x.n).join(", ")}">${out.map((x) =>
      `<div class="tcol"><div class="tbar" style="height:${Math.max(4, Math.round(x.n / max * 100))}%"><span>${x.n || ""}</span></div><i>${x.d.toLocaleDateString([], { weekday: "narrow" })}</i></div>`).join("")}</div>`;
  }

  function nav(active) {
    const it = (k, label, icon) => `<button type="button" class="nb ${active === k ? "on" : ""}" data-act="go" data-v="${k}" aria-current="${active === k ? "page" : "false"}">${icon}<span>${label}</span></button>`;
    const I = {
      home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
      quiz: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
      stats: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
      products: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="3.5"/></svg>',
    };
    return `<nav class="bnav" aria-label="Main">${it("home", "Home", I.home)}${it("quiz", "Practice", I.quiz)}${it("stats", "Stats", I.stats)}${it("products", "Apps", I.products)}</nav>`;
  }

  function home() {
    const exam = EXAMS.find((e) => e.key === (window.EXAM || "RRT"));
    const answered = QS.filter((q) => ST[q.id]).length;
    const att = Object.values(ST).reduce((a, x) => a + x.attempts, 0), cor = Object.values(ST).reduce((a, x) => a + x.correct, 0);
    const rl = QS.filter((q) => RL[q.id]).length;
    const pct = QS.length ? Math.round(answered / QS.length * 100) : 0;
    const next = Math.min(10, QS.length - answered) || 10;
    return `<div class="ob">
      <header class="obtop"><span class="wm">Otter Bay</span><button type="button" class="obgear" data-act="settings" aria-label="Settings">${ICON.gear}</button></header>
      <div class="obscroll">
        <section class="bay">
          <p class="hello">${greet()}</p>
          <h1>${answered ? "Ready to pick up where you left off?" : "Let's get your feet wet."}</h1>
          <div class="water">
            <div class="raft">
              <div class="today">
                <p class="tl">${exam.name} practice</p>
                <p class="tb">${answered ? `${next} new question${next === 1 ? "" : "s"}${rl ? ` and ${rl} from your review list` : ""}` : "Start with 10 questions to see where you stand"}</p>
                <button type="button" class="obstart" data-act="go" data-v="quiz">${answered ? "Keep going" : "Start practicing"}</button>
                ${PAWS}
              </div>
              ${OTTER}
            </div>
            <svg class="waves" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 22c40-14 80 14 120 0s80-14 120 0 80 14 120 0 40-8 40-8v46H0z" fill="#3FB8B3" opacity=".55"/><path d="M0 34c50-12 90 12 140 0s90-12 140 0 80 12 120 0v26H0z" fill="#0A4A63"/></svg>
          </div>
        </section>
        <section class="obsec">
          <h2>Your exam</h2>
          <div class="exams">${EXAMS.map((e) => e.key === exam.key
            ? `<span class="ex on" aria-current="true"><b>${e.name}</b><small>${e.sub}</small></span>`
            : e.soon ? `<span class="ex soon"><b>${e.name}</b><small>Coming soon</small></span>`
            : `<a class="ex" href="${e.href}"><b>${e.name}</b><small>${e.sub}</small></a>`).join("")}</div>
        </section>
        <section class="obsec">
          <div class="meter"><div><b>${answered}</b> of ${QS.length} questions tried</div><div class="track" aria-hidden="true"><i style="width:${pct}%"></i></div>
            <div class="mrow"><span>${att ? Math.round(cor / att * 100) : 0}% correct</span><span>${rl} on your review list</span></div></div>
        </section>
        <section class="obsec">
          <h2>Ways to practice</h2>
          <div class="ways">
            <button type="button" class="way" data-act="go" data-v="review"><b>Review list</b><span>${rl ? `${rl} question${rl === 1 ? "" : "s"} to revisit` : "Missed and unsure questions land here"}</span></button>
            <button type="button" class="way" data-act="go" data-v="exam"><b>Exam mode</b><span>Timed, with answers at the end</span></button>
            <button type="button" class="way" data-act="go" data-v="build"><b>Build a set</b><span>Pick sections and how many</span></button>
            <button type="button" class="way" data-act="go" data-v="stats"><b>Stats</b><span>See how each section is going</span></button>
          </div>
        </section>
        <section class="obsec">
          <h2>This week's tide</h2>
          ${weekBars()}
          <p class="fine">Questions answered each day.</p>
        </section>
      </div>
      ${nav("home")}
    </div>`;
  }

  const PRODUCTS = [
    { key: "RRT", name: "Otter Bay CRT/RRT", color: "#0E6E8C", mark: '<path d="M4 34c6 0 6-8 12-8s6 8 12 8 6-8 12-8 6 8 12 8" />', blurb: "Practice for the NBRC Respiratory Therapist exam: blood gases, ventilator graphics, rhythm strips, and case-based questions in the same format as the test.", facts: ["Questions written to the January 2027 outline", "Rule-out answers, review list, exam mode", "Images and data lists like the real exam"], status: "In development", sample: (window.EXAM_LINKS || {}).RRT },
    { key: "SDS", name: "Otter Bay SDS", color: "#2E3F7A", mark: '<path d="M38 12a16 16 0 1 0 10 28a13 13 0 0 1-10-28z" />', blurb: "Practice for the NBRC Sleep Disorders Specialty exam: staging epochs, respiratory event scoring, PAP titration, and treatment follow-up.", facts: ["Original PSG tracings and PAP reports", "AASM scoring and CMS rule cards", "Questions written to the SDS outline"], status: "In development", sample: (window.EXAM_LINKS || {}).SDS },
    { key: "RPSGT", name: "Otter Bay RPSGT", color: "#2F6B4F", mark: '<path d="M4 28h8l4-12 6 24 6-18 4 6h16" />', blurb: "Practice for the BRPT Registered Polysomnographic Technologist exam, built around the tracings and scoring you use on every shift.", facts: ["Written to the BRPT blueprint", "Scoring, instrumentation, and PAP therapy", "Pediatric and infant scoring practice"], status: "Coming soon", sample: null },
  ];

  function products() {
    return `<div class="ob">
      <header class="obtop"><span class="wm">Otter Bay</span><button type="button" class="obgear" data-act="settings" aria-label="Settings">${ICON.gear}</button></header>
      <div class="obscroll">
        <section class="obsec">
          <h1 class="ph">Otter Bay apps</h1>
          <p class="lede">Exam prep for the people who keep patients breathing and sleeping safely. Pick the app for the credential you're working toward.</p>
        </section>
        ${PRODUCTS.map((p) => `<article class="prod" style="--pc:${p.color}">
          <div class="phead"><svg class="pmark" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="25" fill="var(--pc)"/><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${p.mark}</g></svg>
            <div><h2>${p.name}</h2><span class="pstat ${p.status === "Coming soon" ? "soon" : ""}">${p.status}</span></div></div>
          <p>${p.blurb}</p>
          <ul>${p.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
          <div class="pfoot"><span class="price">Pricing not set yet</span>
            ${p.key === (window.EXAM || "RRT") ? `<button type="button" class="pbtn" data-act="go" data-v="quiz">Try the sample</button>`
              : p.sample ? `<a class="pbtn" href="${p.sample}">Try the sample</a>` : `<span class="pbtn off" aria-disabled="true">Sample coming soon</span>`}</div>
        </article>`).join("")}
        <article class="prod raft2" style="--pc:#7A4E2D">
          <div class="phead"><svg class="pmark" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="25" fill="var(--pc)"/><g fill="#fff"><circle cx="19" cy="27" r="6"/><circle cx="33" cy="27" r="6"/><rect x="18" y="25" width="16" height="4" rx="2"/></g></svg>
            <div><h2>The Raft</h2><span class="pstat soon">Bundle idea</span></div></div>
          <p>Sea otters hold paws while they sleep so they don't drift apart. The Raft keeps all three apps together for programs that teach both respiratory care and sleep technology.</p>
          <div class="pfoot"><span class="price">Pricing not set yet</span><span class="pbtn off" aria-disabled="true">Coming later</span></div>
        </article>
        <p class="fine pad">Questions are drafts under expert review. Not affiliated with the NBRC or BRPT.</p>
      </div>
      ${nav("products")}
    </div>`;
  }

  function stats() {
    return `<div class="ob obstats">
      <header class="obtop"><span class="wm">Otter Bay</span><button type="button" class="obgear" data-act="settings" aria-label="Settings">${ICON.gear}</button></header>
      <div class="obscroll"><div class="stats">${statsBody()}</div></div>
      ${nav("stats")}
    </div>`;
  }

  window.PAGES = Object.assign(window.PAGES || {}, { home, products, stats });
  window.PAGE_ACTIONS = Object.assign(window.PAGE_ACTIONS || {}, {
    go: (b) => {
      const v = b.dataset.v;
      if (v === "home" || v === "products") S.page = v;
      else if (v === "quiz") { S.page = "quiz"; }
      else if (v === "stats" || v === "build") { S.page = "stats"; }
      else if (v === "review") { S.build.src = "review"; S.page = "stats"; }
      else if (v === "exam") { S.mode = "exam"; S.build.mode = "exam"; S.set = ALL.slice(); newRun(); S.page = "quiz"; }
      const sc = document.querySelector(".obscroll"); if (sc) sc.scrollTop = 0;
    },
  });
})();
