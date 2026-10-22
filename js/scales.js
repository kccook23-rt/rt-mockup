/* Reference cards for clinical scales. A question lists the cards it uses in "infoScales"
   (e.g. ["apgar"]). The info button appears only after the learner submits a final answer. */
const T = (head, rows) => `<table class="sct"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
window.SCALES = {
  apgar: { title: "APGAR score", intro: "Scored at 1 and 5 minutes after birth. Each sign scores 0 to 2; total 0 to 10.",
    body: T(["Sign", "0", "1", "2"], [
      ["<b>A</b>ppearance (color)", "Blue or pale all over", "Body pink, extremities blue", "Pink all over"],
      ["<b>P</b>ulse (heart rate)", "Absent", "Below 100/min", "100/min or more"],
      ["<b>G</b>rimace (reflex irritability)", "No response", "Grimace", "Cry, cough, or sneeze"],
      ["<b>A</b>ctivity (muscle tone)", "Limp", "Some flexion", "Active motion"],
      ["<b>R</b>espiration", "Absent", "Slow, irregular; weak cry", "Good effort; strong cry"]]),
    note: "7 to 10 reassuring · 4 to 6 moderately abnormal · 0 to 3 low. If the 5-minute score is below 7, repeat every 5 minutes up to 20 minutes. Resuscitation is never delayed to assign a score.",
    src: "AAP/ACOG Committee Opinion 644, The Apgar Score (2015)" },
  borg: { title: "Modified Borg dyspnea scale (CR10)", intro: "The patient rates breathlessness from 0 to 10.",
    body: T(["Rating", "Description"], [["0", "Nothing at all"], ["0.5", "Very, very slight (just noticeable)"], ["1", "Very slight"], ["2", "Slight"], ["3", "Moderate"], ["4", "Somewhat severe"], ["5", "Severe"], ["6", ""], ["7", "Very severe"], ["8", ""], ["9", "Very, very severe (almost maximal)"], ["10", "Maximal"]]),
    note: "Often used to guide exercise intensity and to track dyspnea during a 6-minute walk test.", src: "Borg GA. Med Sci Sports Exerc. 1982;14(5):377-381" },
  gcs: { title: "Glasgow Coma Scale", intro: "Add the best eye, verbal, and motor responses. Total 3 to 15.",
    body: T(["Score", "Eye opening", "Verbal", "Motor"], [
      ["6", "", "", "Obeys commands"], ["5", "", "Oriented", "Localizes pain"], ["4", "Spontaneous", "Confused", "Withdraws from pain"],
      ["3", "To voice", "Inappropriate words", "Abnormal flexion (decorticate)"], ["2", "To pain", "Incomprehensible sounds", "Extension (decerebrate)"], ["1", "None", "None", "None"]]),
    note: "13 to 15 mild · 9 to 12 moderate · 8 or less severe. A GCS of 8 or less usually means the patient can't protect the airway.",
    src: "Teasdale G, Jennett B. Lancet. 1974;2(7872):81-84" },
  rass: { title: "Richmond Agitation-Sedation Scale (RASS)", intro: "Observe first, then call the patient's name, then use physical stimulation if needed.",
    body: T(["Score", "Term", "Description"], [
      ["+4", "Combative", "Violent; immediate danger to staff"], ["+3", "Very agitated", "Pulls at or removes tubes or catheters; aggressive"],
      ["+2", "Agitated", "Frequent nonpurposeful movement; fights the ventilator"], ["+1", "Restless", "Anxious, but movements not aggressive"],
      ["0", "Alert and calm", ""], ["−1", "Drowsy", "Sustained awakening to voice (eyes open 10 seconds or more)"],
      ["−2", "Light sedation", "Briefly awakens to voice (less than 10 seconds)"], ["−3", "Moderate sedation", "Movement or eye opening to voice, but no eye contact"],
      ["−4", "Deep sedation", "No response to voice; moves or opens eyes to physical stimulation"], ["−5", "Unarousable", "No response to voice or physical stimulation"]]),
    note: "A common target for ventilated adults is light sedation, RASS −2 to 0.", src: "Sessler CN, et al. Am J Respir Crit Care Med. 2002;166(10):1338-1344" },
  berlin: { title: "Berlin definition of ARDS", intro: "All four criteria must be met.",
    body: T(["Criterion", "Requirement"], [
      ["Timing", "Within 1 week of a known insult or new or worsening respiratory symptoms"],
      ["Chest imaging", "Bilateral opacities not fully explained by effusions, collapse, or nodules"],
      ["Origin of edema", "Not fully explained by heart failure or fluid overload"],
      ["Oxygenation (PEEP or CPAP 5 cm H2O or more)", "Mild: PaO2/FIO2 above 200 to 300<br>Moderate: above 100 to 200<br>Severe: 100 or less"]]),
    note: "The 2023 global definition keeps these categories and adds SpO2/FIO2 and patients on HFNC at 30 L/min or more.",
    src: "ARDS Definition Task Force. JAMA. 2012;307(23):2526-2533; Matthay MA, et al. Am J Respir Crit Care Med. 2024;209(1):37-47" },
  gold: { title: "GOLD spirometric grades for COPD", intro: "Requires a postbronchodilator FEV1/FVC below 0.70.",
    body: T(["Grade", "Severity", "FEV1 % predicted"], [["GOLD 1", "Mild", "80% or more"], ["GOLD 2", "Moderate", "50% to 79%"], ["GOLD 3", "Severe", "30% to 49%"], ["GOLD 4", "Very severe", "Below 30%"]]) +
      T(["Group", "Exacerbations in past year", "Symptoms"], [["A", "0 or 1 moderate, no hospitalization", "mMRC 0 to 1 or CAT below 10"], ["B", "0 or 1 moderate, no hospitalization", "mMRC 2 or more or CAT 10 or more"], ["E", "2 or more moderate, or 1 or more leading to hospitalization", "Any"]]),
    note: "The grade describes airflow limitation; the A/B/E group guides initial drug therapy.", src: "Global Initiative for Chronic Obstructive Lung Disease (GOLD) report" },
  naepp: { title: "Asthma severity, age 12 and older (NAEPP)", intro: "Classify by the most severe feature present.",
    body: T(["Feature", "Intermittent", "Mild persistent", "Moderate persistent", "Severe persistent"], [
      ["Symptoms", "2 days/wk or less", "More than 2 days/wk, not daily", "Daily", "Throughout the day"],
      ["Night awakenings", "2×/month or less", "3 to 4×/month", "More than 1×/wk, not nightly", "Often 7×/wk"],
      ["SABA use", "2 days/wk or less", "More than 2 days/wk, not daily", "Daily", "Several times a day"],
      ["Activity limits", "None", "Minor", "Some", "Extreme"],
      ["FEV1 % predicted", "Above 80%", "Above 80%", "60% to 80%", "Below 60%"]]),
    note: "Severity is classified before starting long-term control therapy.", src: "NAEPP Expert Panel Report 3 (2007)" },
  mallampati: { title: "Mallampati classification", intro: "Patient sits upright, opens the mouth fully, and protrudes the tongue without phonating.",
    body: T(["Class", "Structures visible"], [["I", "Soft palate, fauces, uvula, tonsillar pillars"], ["II", "Soft palate, fauces, uvula"], ["III", "Soft palate, base of uvula"], ["IV", "Hard palate only"]]),
    note: "Classes III and IV predict a difficult laryngoscopy.", src: "Samsoon GL, Young JR. Anaesthesia. 1987;42(5):487-490" },
  ahi: { title: "Sleep apnea severity by AHI (adults)", intro: "Apnea-hypopnea index = apneas plus hypopneas per hour of sleep.",
    body: T(["AHI (events/hour)", "Severity"], [["Below 5", "Normal"], ["5 to 14", "Mild"], ["15 to 29", "Moderate"], ["30 or more", "Severe"]]),
    note: "Children use lower cutoffs; an AHI above 1 is abnormal in most pediatric criteria.", src: "American Academy of Sleep Medicine" },
  spaulding: { title: "Spaulding classification", intro: "The level of reprocessing depends on what the device touches.",
    body: T(["Category", "Contact", "Minimum processing", "Examples"], [
      ["Critical", "Sterile tissue or the vascular system", "Sterilization", "Surgical instruments, intravascular catheters"],
      ["Semicritical", "Mucous membranes or nonintact skin", "High-level disinfection", "Bronchoscopes, laryngoscope blades, reusable breathing circuits"],
      ["Noncritical", "Intact skin only", "Low-level disinfection", "BP cuffs, stethoscopes, pulse oximeter probes"]]),
    note: "Thorough cleaning always comes before disinfection or sterilization.", src: "CDC Guideline for Disinfection and Sterilization in Healthcare Facilities (2008, updated)" },
  ls: { title: "L/S ratio and fetal lung maturity", intro: "Lecithin/sphingomyelin ratio measured in amniotic fluid.",
    body: T(["L/S ratio", "Interpretation"], [["2:1 or higher", "Mature; low risk of RDS"], ["1.5:1 to 1.9:1", "Borderline"], ["Below 1.5:1", "Immature; high risk of RDS"]]),
    note: "Infants of diabetic mothers can develop RDS even at 2:1. The presence of phosphatidylglycerol (PG) supports maturity.", src: "Gluck L, et al. Am J Obstet Gynecol. 1971;109(3):440-445" },
  ardsnet: { title: "ARDSNet PEEP/FIO2 table (lower PEEP/higher FIO2)", intro: "Goal: PaO2 55 to 80 mm Hg or SpO2 88% to 95%.",
    body: T(["FIO2", "PEEP (cm H2O)"], [["0.30", "5"], ["0.40", "5 to 8"], ["0.50", "8 to 10"], ["0.60", "10"], ["0.70", "10 to 14"], ["0.80", "14"], ["0.90", "14 to 18"], ["1.0", "18 to 24"]]),
    note: "Move up or down one step at a time to stay within the oxygenation goal.", src: "NIH NHLBI ARDS Network. N Engl J Med. 2000;342(18):1301-1308" },
};

/* Shown only after the final answer (team decision), so a card never gives the answer away. */
function scaleButtons(q, c) {
  if (!c.done || !q.scales || !q.scales.length) return "";
  return `<div class="scalerow">${q.scales.filter((k) => SCALES[k]).map((k) =>
    `<button type="button" class="scalebtn" data-act="scale" data-k="${k}">${ICON.info}<span>${SCALES[k].title}</span></button>`).join("")}</div>`;
}

function scaleSheet() {
  const s = SCALES[S.scale]; if (!s) return "";
  return `<div class="scrim"><div class="dialog scaledlg" role="dialog" aria-modal="true" aria-labelledby="scT">
    <div class="schead"><h2 id="scT">${s.title}</h2><button type="button" class="vb" data-act="scaleclose" aria-label="Close">${ICON.x}</button></div>
    <p class="sub">${s.intro}</p><div class="sctwrap">${s.body}</div>
    ${s.note ? `<p class="scnote">${s.note}</p>` : ""}<p class="scsrc">Source: ${s.src}</p>
    <button type="button" class="btn" data-act="scaleclose" style="width:100%">Back to the question</button></div></div>`;
}
