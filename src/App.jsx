import { useState, useEffect, useCallback, useRef } from "react";

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";

const sampleGrants = [
  // ─── NIH R01 New ──────────────────────────────────────────────────────
  { id:"r01-new-oct25",   category:"Engineering & Instrumentation", title:"NIH R01 (New) – Biomedical Imaging & Engineering", agency:"NIH / NIBIB", mechanism:"R01 – New Application", deadline:"2025-10-05", amount:"Up to $500,000/yr direct costs", piEligible:"All faculty; New/Early Stage Investigators receive priority", notes:"Cycle III. Applications ≥$500K direct costs require white paper & NIBIB staff agreement 6 weeks prior. Submit via Grants.gov.", url:"https://grants.nih.gov/funding/activity-codes/R01" },
  { id:"r01-new-feb26",   category:"Engineering & Instrumentation", title:"NIH R01 (New) – Biomedical Imaging & Engineering", agency:"NIH / NIBIB", mechanism:"R01 – New Application", deadline:"2026-02-05", amount:"Up to $500,000/yr direct costs", piEligible:"All faculty; New/Early Stage Investigators receive priority", notes:"Cycle I. Applications ≥$500K direct costs require white paper & NIBIB staff agreement 6 weeks prior.", url:"https://grants.nih.gov/funding/activity-codes/R01" },
  { id:"r01-new-jun26",   category:"Engineering & Instrumentation", title:"NIH R01 (New) – Biomedical Imaging & Engineering", agency:"NIH / NIBIB", mechanism:"R01 – New Application", deadline:"2026-06-05", amount:"Up to $500,000/yr direct costs", piEligible:"All faculty; New/Early Stage Investigators receive priority", notes:"Cycle II.", url:"https://grants.nih.gov/funding/activity-codes/R01" },
  { id:"r01-new-oct26",   category:"Engineering & Instrumentation", title:"NIH R01 (New) – Biomedical Imaging & Engineering", agency:"NIH / NIBIB", mechanism:"R01 – New Application", deadline:"2026-10-05", amount:"Up to $500,000/yr direct costs", piEligible:"All faculty; New/Early Stage Investigators receive priority", notes:"Cycle III FY2027.", url:"https://grants.nih.gov/funding/activity-codes/R01" },
  { id:"r01-new-feb27",   category:"Engineering & Instrumentation", title:"NIH R01 (New) – Biomedical Imaging & Engineering", agency:"NIH / NIBIB", mechanism:"R01 – New Application", deadline:"2027-02-05", amount:"Up to $500,000/yr direct costs", piEligible:"All faculty; New/Early Stage Investigators receive priority", notes:"Cycle I FY2028. Verify specific NOFO; standard date applies unless otherwise stated.", url:"https://grants.nih.gov/funding/activity-codes/R01" },
  { id:"r01-new-jun27",   category:"Engineering & Instrumentation", title:"NIH R01 (New) – Biomedical Imaging & Engineering", agency:"NIH / NIBIB", mechanism:"R01 – New Application", deadline:"2027-06-05", amount:"Up to $500,000/yr direct costs", piEligible:"All faculty; New/Early Stage Investigators receive priority", notes:"Cycle II FY2028.", url:"https://grants.nih.gov/funding/activity-codes/R01" },
  { id:"r01-new-oct27",   category:"Engineering & Instrumentation", title:"NIH R01 (New) – Biomedical Imaging & Engineering", agency:"NIH / NIBIB", mechanism:"R01 – New Application", deadline:"2027-10-05", amount:"Up to $500,000/yr direct costs", piEligible:"All faculty; New/Early Stage Investigators receive priority", notes:"Cycle III FY2028.", url:"https://grants.nih.gov/funding/activity-codes/R01" },

  // ─── NIH R01 Renewal / Resubmission ──────────────────────────────────
  { id:"r01-ren-nov25",   category:"Engineering & Instrumentation",   title:"NIH R01 (Renewal/Resubmission) – Biomedical Engineering", agency:"NIH / NIBIB", mechanism:"R01 – Renewal / Resubmission", deadline:"2025-11-05", amount:"Up to $500,000/yr direct costs", piEligible:"Current R01 awardees; resubmitting PIs", notes:"Cycle III. Latest cycle to renew a July 2026 end-date award without a gap. Summary statement from prior cycle due ~3 weeks before.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"r01-ren-mar26",   category:"Engineering & Instrumentation",   title:"NIH R01 (Renewal/Resubmission) – Biomedical Engineering", agency:"NIH / NIBIB", mechanism:"R01 – Renewal / Resubmission", deadline:"2026-03-05", amount:"Up to $500,000/yr direct costs", piEligible:"Current R01 awardees; resubmitting PIs", notes:"Cycle I.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"r01-ren-jul26",   category:"Engineering & Instrumentation",   title:"NIH R01 (Renewal/Resubmission) – Biomedical Engineering", agency:"NIH / NIBIB", mechanism:"R01 – Renewal / Resubmission", deadline:"2026-07-05", amount:"Up to $500,000/yr direct costs", piEligible:"Current R01 awardees; resubmitting PIs", notes:"Cycle II.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"r01-ren-nov26",   category:"Engineering & Instrumentation",   title:"NIH R01 (Renewal/Resubmission) – Biomedical Engineering", agency:"NIH / NIBIB", mechanism:"R01 – Renewal / Resubmission", deadline:"2026-11-05", amount:"Up to $500,000/yr direct costs", piEligible:"Current R01 awardees; resubmitting PIs", notes:"Cycle III.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"r01-ren-mar27",   category:"Engineering & Instrumentation",   title:"NIH R01 (Renewal/Resubmission) – Biomedical Engineering", agency:"NIH / NIBIB", mechanism:"R01 – Renewal / Resubmission", deadline:"2027-03-05", amount:"Up to $500,000/yr direct costs", piEligible:"Current R01 awardees; resubmitting PIs", notes:"Cycle I FY2028.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"r01-ren-jul27",   category:"Engineering & Instrumentation",   title:"NIH R01 (Renewal/Resubmission) – Biomedical Engineering", agency:"NIH / NIBIB", mechanism:"R01 – Renewal / Resubmission", deadline:"2027-07-05", amount:"Up to $500,000/yr direct costs", piEligible:"Current R01 awardees; resubmitting PIs", notes:"Cycle II FY2028.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"r01-ren-nov27",   category:"Engineering & Instrumentation",   title:"NIH R01 (Renewal/Resubmission) – Biomedical Engineering", agency:"NIH / NIBIB", mechanism:"R01 – Renewal / Resubmission", deadline:"2027-11-05", amount:"Up to $500,000/yr direct costs", piEligible:"Current R01 awardees; resubmitting PIs", notes:"Cycle III FY2028.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },

  // ─── NIBIB Trailblazer R21 ────────────────────────────────────────────
  { id:"tblazer-oct25",   category:"Engineering & Instrumentation",   title:"NIBIB Trailblazer Award – New & Early Stage Investigators (R21)", agency:"NIH / NIBIB", mechanism:"R21 Enhanced (Trailblazer) – PA-25-169", deadline:"2025-10-16", amount:"$400,000 direct costs over 3 years", piEligible:"NIH-defined New and Early Stage Investigators ONLY", notes:"Cycle III. No preliminary data required. High-risk, high-impact at engineering/life sciences interface. Cannot submit NIBIB R01 or parent R21 in same cycle. Contact program staff before applying.", url:"https://grants.nih.gov/grants/guide/pa-files/PA-25-169.html" },
  { id:"tblazer-feb26",   category:"Engineering & Instrumentation",   title:"NIBIB Trailblazer Award – New & Early Stage Investigators (R21)", agency:"NIH / NIBIB", mechanism:"R21 Enhanced (Trailblazer) – PA-25-169", deadline:"2026-02-16", amount:"$400,000 direct costs over 3 years", piEligible:"NIH-defined New and Early Stage Investigators ONLY", notes:"Cycle I. Last full cycle under PA-25-169. Cannot submit NIBIB R01 or parent R21 in same cycle.", url:"https://grants.nih.gov/grants/guide/pa-files/PA-25-169.html" },
  { id:"tblazer-may26",   category:"Engineering & Instrumentation",   title:"NIBIB Trailblazer Award – FINAL Extended Deadline (NOT-EB-25-007)", agency:"NIH / NIBIB", mechanism:"R21 Enhanced (Trailblazer) – PA-25-169", deadline:"2026-05-08", amount:"$400,000 direct costs over 3 years", piEligible:"NIH-defined New and Early Stage Investigators ONLY", notes:"LAST submission date under current announcement. Monitor NIBIB website for successor announcement. No preliminary data required.", url:"https://grants.nih.gov/grants/guide/pa-files/PA-25-169.html" },
  { id:"tblazer-oct26",   category:"Engineering & Instrumentation",   title:"NIBIB Trailblazer Award – New & Early Stage Investigators (R21)", agency:"NIH / NIBIB", mechanism:"R21 Enhanced (Trailblazer) – Successor PA (TBA)", deadline:"2026-10-16", amount:"~$400,000 direct costs over 3 years (anticipated)", piEligible:"NIH-defined New and Early Stage Investigators ONLY (anticipated)", notes:"Estimated date based on Cycle III standard date. A successor announcement to PA-25-169 is anticipated. Confirm official NOFO on NIBIB website before applying. Deadline shown is projected.", url:"https://www.nibib.nih.gov/funding" },
  { id:"tblazer-feb27",   category:"Engineering & Instrumentation",   title:"NIBIB Trailblazer Award – New & Early Stage Investigators (R21)", agency:"NIH / NIBIB", mechanism:"R21 Enhanced (Trailblazer) – Successor PA (TBA)", deadline:"2027-02-16", amount:"~$400,000 direct costs over 3 years (anticipated)", piEligible:"NIH-defined New and Early Stage Investigators ONLY (anticipated)", notes:"Projected Cycle I under successor announcement. Confirm official NOFO on NIBIB website. Deadline shown is projected.", url:"https://www.nibib.nih.gov/funding" },
  { id:"tblazer-oct27",   category:"Engineering & Instrumentation",   title:"NIBIB Trailblazer Award – New & Early Stage Investigators (R21)", agency:"NIH / NIBIB", mechanism:"R21 Enhanced (Trailblazer) – Successor PA (TBA)", deadline:"2027-10-16", amount:"~$400,000 direct costs over 3 years (anticipated)", piEligible:"NIH-defined New and Early Stage Investigators ONLY (anticipated)", notes:"Projected Cycle III under successor announcement. Confirm official NOFO on NIBIB website. Deadline shown is projected.", url:"https://www.nibib.nih.gov/funding" },

  // ─── NIH R21 Parent ───────────────────────────────────────────────────
  { id:"r21-oct25",       category:"Engineering & Instrumentation",       title:"NIH R21 (Parent) – Exploratory/Developmental Research", agency:"NIH / NIBIB", mechanism:"R21 – PA-25-304 / PA-25-306", deadline:"2025-10-16", amount:"Up to $275,000 direct costs over 2 years", piEligible:"All investigators; contact NIBIB staff before applying", notes:"Cycle III. Must align with NIBIB mission. Selective funding — no fixed payline.", url:"https://www.nibib.nih.gov/funding/exploratory-developmental-grant-program-r21" },
  { id:"r21-feb26",       category:"Engineering & Instrumentation",       title:"NIH R21 (Parent) – Exploratory/Developmental Research", agency:"NIH / NIBIB", mechanism:"R21 – PA-25-304 / PA-25-306", deadline:"2026-02-16", amount:"Up to $275,000 direct costs over 2 years", piEligible:"All investigators; contact NIBIB staff before applying", notes:"Cycle I.", url:"https://www.nibib.nih.gov/funding/exploratory-developmental-grant-program-r21" },
  { id:"r21-jun26",       category:"Engineering & Instrumentation",       title:"NIH R21 (Parent) – Exploratory/Developmental Research", agency:"NIH / NIBIB", mechanism:"R21 – PA-25-304 / PA-25-306", deadline:"2026-06-16", amount:"Up to $275,000 direct costs over 2 years", piEligible:"All investigators; contact NIBIB staff before applying", notes:"Cycle II.", url:"https://www.nibib.nih.gov/funding/exploratory-developmental-grant-program-r21" },
  { id:"r21-oct26",       category:"Engineering & Instrumentation",       title:"NIH R21 (Parent) – Exploratory/Developmental Research", agency:"NIH / NIBIB", mechanism:"R21 – Standard (Successor PA TBA)", deadline:"2026-10-16", amount:"Up to $275,000 direct costs over 2 years", piEligible:"All investigators; contact NIBIB staff before applying", notes:"Cycle III. PA-25-304/306 may have expired — verify active NOFO on Grants.gov.", url:"https://www.nibib.nih.gov/funding/exploratory-developmental-grant-program-r21" },
  { id:"r21-feb27",       category:"Engineering & Instrumentation",       title:"NIH R21 (Parent) – Exploratory/Developmental Research", agency:"NIH / NIBIB", mechanism:"R21 – Standard", deadline:"2027-02-16", amount:"Up to $275,000 direct costs over 2 years", piEligible:"All investigators; contact NIBIB staff before applying", notes:"Cycle I FY2028. Verify active NOFO on Grants.gov.", url:"https://www.nibib.nih.gov/funding/exploratory-developmental-grant-program-r21" },
  { id:"r21-oct27",       category:"Engineering & Instrumentation",       title:"NIH R21 (Parent) – Exploratory/Developmental Research", agency:"NIH / NIBIB", mechanism:"R21 – Standard", deadline:"2027-10-16", amount:"Up to $275,000 direct costs over 2 years", piEligible:"All investigators; contact NIBIB staff before applying", notes:"Cycle III FY2028. Verify active NOFO on Grants.gov.", url:"https://www.nibib.nih.gov/funding/exploratory-developmental-grant-program-r21" },

  // ─── NIH K-series Career Development ─────────────────────────────────
  { id:"k-oct25",         category:"General / Unrestricted",         title:"NIH K-Series – Research Career Development (New)", agency:"NIH / NIBIB", mechanism:"K01 / K08 / K23 / K99", deadline:"2025-10-12", amount:"Typically $150,000–$250,000/yr (mechanism-dependent)", piEligible:"Early-career faculty and postdocs (mechanism-dependent)", notes:"Cycle III. Mentored career development awards support protected research time. Verify specific K mechanism & participating IC.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"k-feb26",         category:"General / Unrestricted",         title:"NIH K-Series – Research Career Development (New)", agency:"NIH / NIBIB", mechanism:"K01 / K08 / K23 / K99", deadline:"2026-02-12", amount:"Typically $150,000–$250,000/yr (mechanism-dependent)", piEligible:"Early-career faculty and postdocs (mechanism-dependent)", notes:"Cycle I.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"k-jun26",         category:"General / Unrestricted",         title:"NIH K-Series – Research Career Development (New)", agency:"NIH / NIBIB", mechanism:"K01 / K08 / K23 / K99", deadline:"2026-06-12", amount:"Typically $150,000–$250,000/yr (mechanism-dependent)", piEligible:"Early-career faculty and postdocs (mechanism-dependent)", notes:"Cycle II.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"k-oct26",         category:"General / Unrestricted",         title:"NIH K-Series – Research Career Development (New)", agency:"NIH / NIBIB", mechanism:"K01 / K08 / K23 / K99", deadline:"2026-10-12", amount:"Typically $150,000–$250,000/yr (mechanism-dependent)", piEligible:"Early-career faculty and postdocs (mechanism-dependent)", notes:"Cycle III.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"k-feb27",         category:"General / Unrestricted",         title:"NIH K-Series – Research Career Development (New)", agency:"NIH / NIBIB", mechanism:"K01 / K08 / K23 / K99", deadline:"2027-02-12", amount:"Typically $150,000–$250,000/yr (mechanism-dependent)", piEligible:"Early-career faculty and postdocs (mechanism-dependent)", notes:"Cycle I FY2028.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"k-jun27",         category:"General / Unrestricted",         title:"NIH K-Series – Research Career Development (New)", agency:"NIH / NIBIB", mechanism:"K01 / K08 / K23 / K99", deadline:"2027-06-12", amount:"Typically $150,000–$250,000/yr (mechanism-dependent)", piEligible:"Early-career faculty and postdocs (mechanism-dependent)", notes:"Cycle II FY2028.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },
  { id:"k-oct27",         category:"General / Unrestricted",         title:"NIH K-Series – Research Career Development (New)", agency:"NIH / NIBIB", mechanism:"K01 / K08 / K23 / K99", deadline:"2027-10-12", amount:"Typically $150,000–$250,000/yr (mechanism-dependent)", piEligible:"Early-career faculty and postdocs (mechanism-dependent)", notes:"Cycle III FY2028.", url:"https://grants.nih.gov/grants-process/submit/submission-policies/standard-due-dates" },

  // ─── NSF CAREER ────────────────────────────────────────────────────────
  { id:"career-jul25",    category:"Engineering & Instrumentation",    title:"NSF CAREER – Engineering of Biomedical Systems", agency:"NSF", mechanism:"CAREER", deadline:"2025-07-23", amount:"$500,000 minimum over 5 years (ENG directorate)", piEligible:"Untenured assistant professors ONLY; no prior CAREER award", notes:"Annual deadline — fourth Wednesday of July. Must integrate research AND education. Departmental letter required. Max 1 proposal/PI/year. Contact CBET/EBMS program officer well in advance.", url:"https://www.nsf.gov/funding/opportunities/career-faculty-early-career-development-program" },
  { id:"career-jul26",    category:"Engineering & Instrumentation",    title:"NSF CAREER – Engineering of Biomedical Systems", agency:"NSF", mechanism:"CAREER", deadline:"2026-07-22", amount:"$500,000 minimum over 5 years (ENG directorate)", piEligible:"Untenured assistant professors ONLY; no prior CAREER award", notes:"FY2026 annual deadline. NOTE: FY2026 White House budget proposed eliminating CAREER; confirm program status before preparing application. Departmental letter required.", url:"https://www.nsf.gov/funding/opportunities/career-faculty-early-career-development-program" },
  { id:"career-jul27",    category:"Engineering & Instrumentation",    title:"NSF CAREER – Engineering of Biomedical Systems", agency:"NSF", mechanism:"CAREER", deadline:"2027-07-28", amount:"$500,000 minimum over 5 years (ENG directorate)", piEligible:"Untenured assistant professors ONLY; no prior CAREER award", notes:"FY2027 annual deadline — fourth Wednesday of July (estimated July 28, 2027). Confirm solicitation and program continuity with NSF before preparing. Budget landscape uncertain.", url:"https://www.nsf.gov/funding/opportunities/career-faculty-early-career-development-program" },

  // ─── NSF Engineering of Biomedical Systems (rolling) ─────────────────
  { id:"ebms-2025",       category:"Engineering & Instrumentation",       title:"NSF Engineering of Biomedical Systems (EBMS) – Open Submission", agency:"NSF / CBET", mechanism:"Standard Research Grant (Rolling)", deadline:"2025-12-15", amount:"~$100,000–$200,000/yr; 1–3 years", piEligible:"All faculty", notes:"Rolling — no fixed annual deadline. Consult EBMS program officer before submitting. Projects must integrate engineering AND biomedical sciences. Deadline shown is a suggested target.", url:"https://www.nsf.gov/funding/opportunities/engineering-biomedical-systems" },
  { id:"ebms-2026",       category:"Engineering & Instrumentation",       title:"NSF Engineering of Biomedical Systems (EBMS) – Open Submission", agency:"NSF / CBET", mechanism:"Standard Research Grant (Rolling)", deadline:"2026-12-15", amount:"~$100,000–$200,000/yr; 1–3 years", piEligible:"All faculty", notes:"Rolling. Contact EBMS program officer before submission. CAREER proposals to EBMS must meet July annual deadline.", url:"https://www.nsf.gov/funding/opportunities/engineering-biomedical-systems" },
  { id:"ebms-2027",       category:"Engineering & Instrumentation",       title:"NSF Engineering of Biomedical Systems (EBMS) – Open Submission", agency:"NSF / CBET", mechanism:"Standard Research Grant (Rolling)", deadline:"2027-12-15", amount:"~$100,000–$200,000/yr; 1–3 years", piEligible:"All faculty", notes:"Rolling. Confirm program continuity with NSF. Deadline shown is a suggested target for FY2027 submission planning.", url:"https://www.nsf.gov/funding/opportunities/engineering-biomedical-systems" },

  // ─── NSF Biomechanics & Mechanobiology ───────────────────────────────
  { id:"bmmb-aug26",      category:"Musculoskeletal & Orthopedics",      title:"NSF Biomechanics & Mechanobiology (BMMB)", agency:"NSF / CMMI", mechanism:"Standard Research Grant", deadline:"2026-08-11", amount:"~$100,000–$130,000/yr; 3 years typical", piEligible:"All faculty", notes:"Required due date August 11, 2026. Supports fundamental research on biological mechanics from subcellular to whole-organism scale. Must have clear biology AND mechanics components.", url:"https://www.nsf.gov/funding/opportunities/bmmb-biomechanics-mechanobiology" },
  { id:"bmmb-aug27",      category:"Musculoskeletal & Orthopedics",      title:"NSF Biomechanics & Mechanobiology (BMMB)", agency:"NSF / CMMI", mechanism:"Standard Research Grant", deadline:"2027-08-10", amount:"~$100,000–$130,000/yr; 3 years typical", piEligible:"All faculty", notes:"Projected 2027 deadline (typically second Tuesday of August). Verify official date on NSF when solicitation is released.", url:"https://www.nsf.gov/funding/opportunities/bmmb-biomechanics-mechanobiology" },

  // ─── DOD CDMRP – Breast Cancer Research Program ──────────────────────
  { id:"bcrp-fy25-pre",   category:"Cancer",   title:"DOD BCRP – Breakthrough Award FY25 (Pre-Application)", agency:"DOD / CDMRP", mechanism:"Breakthrough Award – Investigator-Initiated", deadline:"2025-08-27", amount:"Level 1: ≤$700K; Level 2: ≤$7M (total costs)", piEligible:"Independent investigators; Assistant Professor or above", notes:"FY25. Pre-application via eBRAP.org by 5:00 PM ET. Full application deadline: September 10, 2025. Consumer advocate co-investigator strongly recommended.", url:"https://cdmrp.health.mil/funding/bcrp" },
  { id:"bcrp-fy25-full",  category:"Cancer",  title:"DOD BCRP – Breakthrough Award FY25 (Full Application)", agency:"DOD / CDMRP", mechanism:"Breakthrough Award – By Invitation Only", deadline:"2025-09-10", amount:"Level 1: ≤$700K; Level 2: ≤$7M (total costs)", piEligible:"Invited applicants only (after pre-application review)", notes:"FY25. Full application by invitation only. Pre-application required 8/27/2025. Submit via Grants.gov 11:59 PM ET. eBRAP verification by 9/15/2025.", url:"https://cdmrp.health.mil/funding/bcrp" },
  { id:"bcrp-fy26",       category:"Cancer",       title:"DOD BCRP – Breast Cancer Research Program FY26 (Pre-Announced)", agency:"DOD / CDMRP", mechanism:"Multiple mechanisms (TBA)", deadline:"2026-09-01", amount:"$130,000,000 total FY26 appropriation", piEligible:"All faculty; mechanism-specific eligibility TBA", notes:"FY26 pre-announced. FY26 Appropriations Act signed February 2026. Exact deadlines TBA on Grants.gov. Subscribe to eBRAP.org for notifications. Deadline shown is estimated from FY25 pattern.", url:"https://cdmrp.health.mil/funding/bcrp" },
  { id:"bcrp-fy27",       category:"Cancer",       title:"DOD BCRP – Breast Cancer Research Program FY27 (Projected)", agency:"DOD / CDMRP", mechanism:"Multiple mechanisms (TBA)", deadline:"2027-09-01", amount:"~$130,000,000 total (anticipated)", piEligible:"All faculty; mechanism-specific eligibility TBA", notes:"FY27 projected based on annual BCRP pattern. Official announcement expected fall 2026. Subscribe to eBRAP.org for updates. Deadline shown is estimated.", url:"https://cdmrp.health.mil/funding/bcrp" },

  // ─── DOD CDMRP – Peer Reviewed Cancer Research Program ───────────────
  { id:"prcrp-fy26",      category:"Cancer",      title:"DOD Peer Reviewed Cancer Research Program (PRCRP) FY26", agency:"DOD / CDMRP", mechanism:"Clinical Trial & Investigator-Initiated Awards", deadline:"2026-09-15", amount:"$165,000,000 total FY26; up to $3M/project direct costs", piEligible:"Assistant Professor or above", notes:"FY26. Covers 20 cancer types. Supports clinical trials advancing preclinical research. IND/IDE required by deadline. Pre-application via eBRAP; full application by invitation. Deadline estimated — subscribe to eBRAP for official dates.", url:"https://cdmrp.health.mil/funding/prcrp" },
  { id:"prcrp-fy27",      category:"Cancer",      title:"DOD Peer Reviewed Cancer Research Program (PRCRP) FY27 (Projected)", agency:"DOD / CDMRP", mechanism:"Clinical Trial & Investigator-Initiated Awards", deadline:"2027-09-15", amount:"~$165,000,000 total (anticipated)", piEligible:"Assistant Professor or above", notes:"FY27 projected based on annual PRCRP cycle. Official announcement expected fall 2026. Subscribe to eBRAP.org for updates.", url:"https://cdmrp.health.mil/funding/prcrp" },

  // ─── DOD CDMRP – Orthopaedic Research Program ────────────────────────
  { id:"orp-fy26",        category:"Musculoskeletal & Orthopedics",        title:"DOD Orthopaedic Research Program (ORP) FY26", agency:"DOD / CDMRP", mechanism:"Investigator-Initiated Research Award (TBA)", deadline:"2026-08-01", amount:"Varies by mechanism (TBA)", piEligible:"Independent investigators; Assistant Professor or above", notes:"FY26 pre-announced. Focus: battlefield fracture-related infection, composite tissue regeneration, combat-related extremity trauma. Official deadlines TBA on Grants.gov. Deadline shown is estimated.", url:"https://cdmrp.health.mil/funding/orp" },
  { id:"orp-fy27",        category:"Musculoskeletal & Orthopedics",        title:"DOD Orthopaedic Research Program (ORP) FY27 (Projected)", agency:"DOD / CDMRP", mechanism:"Investigator-Initiated Research Award (TBA)", deadline:"2027-08-01", amount:"Varies by mechanism (TBA)", piEligible:"Independent investigators; Assistant Professor or above", notes:"FY27 projected based on annual ORP pattern. Official announcement expected spring/summer 2027. Deadline shown is estimated.", url:"https://cdmrp.health.mil/funding/orp" },

  // ─── DOD CDMRP – ALS Research Program ───────────────────────────────
  { id:"alsrp-fy26",      category:"Neuroscience",      title:"DOD ALS Research Program (ALSRP) FY26", agency:"DOD / CDMRP", mechanism:"Investigator-Initiated (TBA)", deadline:"2026-08-15", amount:"Varies by mechanism (TBA)", piEligible:"Independent investigators", notes:"FY26 pre-announced. Supports high-impact ALS research with clinical relevance. Official deadlines TBA on Grants.gov. Deadline shown is estimated.", url:"https://cdmrp.health.mil/funding/alsrp" },
  { id:"alsrp-fy27",      category:"Neuroscience",      title:"DOD ALS Research Program (ALSRP) FY27 (Projected)", agency:"DOD / CDMRP", mechanism:"Investigator-Initiated (TBA)", deadline:"2027-08-15", amount:"Varies by mechanism (TBA)", piEligible:"Independent investigators", notes:"FY27 projected based on annual ALSRP pattern. Official announcement expected spring/summer 2027. Subscribe to eBRAP.org for updates.", url:"https://cdmrp.health.mil/funding/alsrp" },

  // ─── DOD MURI (Multidisciplinary University Research Initiative) ──────
  { id:"muri-fy27",       category:"Engineering & Instrumentation",       title:"DOD MURI – Multidisciplinary University Research Initiative FY27", agency:"DOD / AFOSR", mechanism:"MURI (Multi-PI, Multi-institution)", deadline:"2026-05-01", amount:"~$1,500,000–$3,000,000/yr; up to 5 years", piEligible:"Faculty at accredited US universities; multi-institution teams encouraged", notes:"FY2027 NOFO expected March 2027. White paper deadline estimated May 2026; full proposal estimated September 2026. High-risk basic research; broad topic areas including biomedical engineering and AI. Submit white paper first. Verify exact dates on Grants.gov / AFOSR website.", url:"https://www.afrl.af.mil/AFOSR/MURI" },

  // ─── NIH BPI U01 – Bioengineering Partnerships with Industry ─────────
  // PAR-24-325 | NIBIB, NEI, NIA, NCI | Updated March 31, 2025
  // Academic-industrial partnership REQUIRED. LOI due 30 days before each deadline.
  // Applications ≥$500K/yr direct costs require NIBIB contact 6 weeks prior.
  // NIBIB contact: Guoying Liu, Ph.D. 301-594-5220 liug@mail.nih.gov
  { id:"bpi-jan26",   category:"Engineering & Instrumentation",   title:"NIH BPI U01 – Bioengineering Partnerships with Industry", agency:"NIH / NIBIB", mechanism:"U01 Cooperative Agreement (PAR-24-325)", deadline:"2026-01-27", amount:"Budget reflects actual needs; up to 5 years", piEligible:"Academic-industrial partnership REQUIRED; all career levels", notes:"PAR-24-325. Funds interdisciplinary academic-industry teams to develop & validate bioengineering tools/technologies for unmet biomedical needs. Industrial partner is mandatory. Letter of Intent due 30 days prior (~Dec 28, 2025). Updated March 31, 2025 to align with agency priorities. Contact NIBIB program staff before applying: Guoying Liu liug@mail.nih.gov.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-325.html" },
  { id:"bpi-may26",   category:"Engineering & Instrumentation",   title:"NIH BPI U01 – Bioengineering Partnerships with Industry", agency:"NIH / NIBIB", mechanism:"U01 Cooperative Agreement (PAR-24-325)", deadline:"2026-05-27", amount:"Budget reflects actual needs; up to 5 years", piEligible:"Academic-industrial partnership REQUIRED; all career levels", notes:"PAR-24-325. LOI due ~April 27, 2026. Scope: imaging instrumentation, biosensors, nanotechnology, bioinformatics, medical devices. Partners must include at least one industrial organization. Projects must deliver measurable milestones within 5–10 years.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-325.html" },
  { id:"bpi-jan27",   category:"Engineering & Instrumentation",   title:"NIH BPI U01 – Bioengineering Partnerships with Industry", agency:"NIH / NIBIB", mechanism:"U01 Cooperative Agreement (PAR-24-325)", deadline:"2027-01-27", amount:"Budget reflects actual needs; up to 5 years", piEligible:"Academic-industrial partnership REQUIRED; all career levels", notes:"PAR-24-325. LOI due ~Dec 28, 2026. Earliest project start December 2027. Expiration September 8, 2027.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-325.html" },
  { id:"bpi-may27",   category:"Engineering & Instrumentation",   title:"NIH BPI U01 – Bioengineering Partnerships with Industry", agency:"NIH / NIBIB", mechanism:"U01 Cooperative Agreement (PAR-24-325)", deadline:"2027-05-27", amount:"Budget reflects actual needs; up to 5 years", piEligible:"Academic-industrial partnership REQUIRED; all career levels", notes:"PAR-24-325. FINAL deadline cycle before expiration September 8, 2027. LOI due ~April 27, 2027. Earliest project start April 2028.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-325.html" },

  // ─── NIH S10 – Shared Instrumentation Grant (SIG) ────────────────────
  // PAR-24-265 | ORIP (NIBIB participates) | $50,000–$750,000
  // Funds purchase/upgrade of shared-use commercially available instruments.
  // Instruments: microscopes, imagers, mass specs, NMR, flow cytometers, biosensors, sequencers, etc.
  // No indirect costs allowed. 1-year award. Requires institutional coordination to avoid duplicate submissions.
  { id:"sig-jun26",   category:"Engineering & Instrumentation",   title:"NIH S10 Shared Instrumentation Grant (SIG) – 2026", agency:"NIH / ORIP", mechanism:"S10 Instrumentation (PAR-24-265)", deadline:"2026-06-01", amount:"$50,000–$750,000; 1 year; no indirect costs", piEligible:"Groups of NIH-supported investigators; institutionally coordinated", notes:"PAR-24-265. Funds purchase or upgrade of a single shared-use instrument or integrated system for NIH-funded biomedical research. Instruments include: imaging systems, microscopes (including cryo-EM), NMR spectrometers, mass spectrometers, flow cytometers, sequencers, biosensors. Must be used on shared basis. No indirect costs. Requires institutional coordination — check with UTSW Office of Research before submitting to avoid overlapping proposals.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-265.html" },
  { id:"sig-jun27",   category:"Engineering & Instrumentation",   title:"NIH S10 Shared Instrumentation Grant (SIG) – 2027", agency:"NIH / ORIP", mechanism:"S10 Instrumentation (PAR-24-265)", deadline:"2027-06-01", amount:"$50,000–$750,000; 1 year; no indirect costs", piEligible:"Groups of NIH-supported investigators; institutionally coordinated", notes:"PAR-24-265. Final cycle (expiration June 2, 2027). Same scope as 2026 cycle. Check with UTSW Office of Research to coordinate. No indirect costs.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-265.html" },

  // ─── NIH S10 – High-End Instrumentation Grant (HEI) ──────────────────
  // PAR-24-264 | ORIP | $750,001–$2,000,000
  { id:"hei-jun26",   category:"Engineering & Instrumentation",   title:"NIH S10 High-End Instrumentation Grant (HEI) – 2026", agency:"NIH / ORIP", mechanism:"S10 Instrumentation (PAR-24-264)", deadline:"2026-06-01", amount:"$750,001–$2,000,000; 1 year; no indirect costs", piEligible:"Groups of NIH-supported investigators; institutionally coordinated", notes:"PAR-24-264. Funds purchase of high-end instruments: MRI/PET-CT imagers, cyclotrons, photoacoustic imagers, cryo-electron microscopes, NMR spectrometers, X-ray diffractometers, super-resolution microscopes. Minimum award $750,001; maximum $2,000,000. Must provide table of all previous S10 awards at institution (FYs 2021–2025). Advisory Committee required. Check with UTSW Office of Research for institutional coordination.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-264.html" },
  { id:"hei-jun27",   category:"Engineering & Instrumentation",   title:"NIH S10 High-End Instrumentation Grant (HEI) – 2027", agency:"NIH / ORIP", mechanism:"S10 Instrumentation (PAR-24-264)", deadline:"2027-06-01", amount:"$750,001–$2,000,000; 1 year; no indirect costs", piEligible:"Groups of NIH-supported investigators; institutionally coordinated", notes:"PAR-24-264. Same scope as 2026 cycle. Verify announcement status — a successor PAR may be issued. No indirect costs. Institutional coordination required.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-264.html" },

  // ─── NIH S10 – Basic Instrumentation Grant (BIG) ─────────────────────
  // PAR-24-326 | ORIP | Up to $350,000 | Limited to institutions with <$500,001 in S10 awards in past 3 FYs
  { id:"big-jun26",   category:"Engineering & Instrumentation",   title:"NIH S10 Basic Instrumentation Grant (BIG) – 2026", agency:"NIH / ORIP", mechanism:"S10 Instrumentation (PAR-24-326) – Limited Competition", deadline:"2026-06-01", amount:"Up to $350,000; 1 year; no indirect costs", piEligible:"Institutions that received <$500,001 total in S10 awards in FY2023–2025", notes:"PAR-24-326. LIMITED COMPETITION — only eligible if UTSW received less than $500,001 total in S10 awards in FY2023–2025. Supports purchase of modern instruments needed by NIH-funded investigators. Targets institutions with limited prior S10 funding. Only ONE BIG application per receipt date per institution. Verify UTSW eligibility with Office of Research before preparing.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-326.html" },
  { id:"big-jun27",   category:"Engineering & Instrumentation",   title:"NIH S10 Basic Instrumentation Grant (BIG) – 2027", agency:"NIH / ORIP", mechanism:"S10 Instrumentation (PAR-24-326) – Limited Competition", deadline:"2027-06-01", amount:"Up to $350,000; 1 year; no indirect costs", piEligible:"Institutions that received <$500,001 total in S10 awards in FY2024–2026", notes:"PAR-24-326. LIMITED COMPETITION. Eligibility window shifts — UTSW must have received <$500,001 in S10 awards in FY2024–2026. Only ONE BIG application per receipt date. Verify eligibility before preparing.", url:"https://grants.nih.gov/grants/guide/pa-files/PAR-24-326.html" },
];

const CATEGORIES = [
  "Cancer",
  "Neuroscience",
  "Engineering & Instrumentation",
  "Cardiovascular",
  "Diabetes & Metabolism",
  "Immunology & Infectious Disease",
  "Musculoskeletal & Orthopedics",
  "Drug Delivery & Nanomedicine",
  "AI & Computation",
  "Philanthropy & Foundation",
  "General / Unrestricted",
];

const categoryColors = {
  "Cancer":                          { color:"#ff8a8a", bg:"#3d1515" },
  "Neuroscience":                    { color:"#b48aff", bg:"#2a1a40" },
  "Engineering & Instrumentation":   { color:"#5bc8f5", bg:"#0d2535" },
  "Cardiovascular":                  { color:"#ff6b9d", bg:"#3d1228" },
  "Diabetes & Metabolism":           { color:"#ffd166", bg:"#3a2c00" },
  "Immunology & Infectious Disease": { color:"#6adf9e", bg:"#0d2e1e" },
  "Musculoskeletal & Orthopedics":   { color:"#f5a623", bg:"#3a2600" },
  "Drug Delivery & Nanomedicine":    { color:"#a8e6cf", bg:"#0d2a22" },
  "AI & Computation":                { color:"#85d4ff", bg:"#0d2030" },
  "Philanthropy & Foundation":       { color:"#e8c56a", bg:"#352800" },
  "General / Unrestricted":          { color:"#8ab4d4", bg:"#152030" },
};

const agencyColors = { NIH:"#4f86c6", NSF:"#6aaa64", DOD:"#c97b3a", HHMI:"#9b6bc4", AHA:"#c94a4a", Other:"#7a9a8a" };

function getCategoryStyle(cat) {
  return categoryColors[cat] || { color:"#8ab4d4", bg:"#152030" };
}

function getAgencyColor(agency = "") {
  for (const key of Object.keys(agencyColors)) {
    if (agency.toUpperCase().includes(key)) return agencyColors[key];
  }
  return agencyColors.Other;
}

// Normalize various date formats to YYYY-MM-DD
function normalizeDate(raw) {
  if (!raw) return "";
  const s = String(raw).trim();
  // Already correct format
  if (s.match(/^\d{4}-\d{2}-\d{2}$/)) return s;
  // Try parsing as a JS date (handles M/D/YYYY, Month D YYYY, etc.)
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const dy = String(d.getDate()).padStart(2, "0");
    return `${yr}-${mo}-${dy}`;
  }
  return s; // return as-is if unparseable — getDaysUntil will return 9999
}

function getDaysUntil(dateStr) {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return 9999;
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return 9999;
  return Math.round((d - today) / 86400000);
}

function urgencyLabel(days) {
  if (days < 0) return { label:"Passed", color:"#888", bg:"#2a2a2a" };
  if (days <= 14) return { label:"Urgent", color:"#ff6b6b", bg:"#3d1a1a" };
  if (days <= 30) return { label:"Soon", color:"#ffd166", bg:"#3d3010" };
  return { label:"Upcoming", color:"#6aaa64", bg:"#1a3020" };
}

function formatDate(dateStr) {
  if (!dateStr) return "No date";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr; // show raw string if unparseable
  return d.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
}

const emptyForm = { title:"", agency:"", mechanism:"", deadline:"", amount:"", piEligible:"", notes:"", url:"", category:"" };

export default function GrantTracker() {
  const [grants, setGrants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [filterAgency, setFilterAgency] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [windowMonths, setWindowMonths] = useState(3);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  // ── Save to Google Sheet ──────────────────────────────────────────────
  const saveToSheet = useCallback((g) => {
    console.log("saveToSheet called, count:", g.length, "url:", SCRIPT_URL ? "set" : "MISSING");
    if (!SCRIPT_URL) {
      console.warn("SCRIPT_URL is empty — save skipped");
      return;
    }
    setSyncStatus("saving");
    try { localStorage.setItem("bme-grants-fallback", JSON.stringify(g)); } catch {}

    fetch(SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "save", grants: g }),
    })
      .then(r => r.text())
      .then(text => {
        console.log("Sheet response:", text);
        let data;
        try { data = JSON.parse(text); }
        catch { throw new Error("Non-JSON: " + text.slice(0, 200)); }
        if (data.success) {
          setSyncStatus("saved");
          setLastUpdated(new Date().toISOString());
          if (saveTimer.current) clearTimeout(saveTimer.current);
          saveTimer.current = setTimeout(() => setSyncStatus("idle"), 3000);
        } else {
          console.error("Sheet save error:", data.error);
          setSyncStatus("error");
        }
      })
      .catch(err => { console.error("saveToSheet error:", err); setSyncStatus("error"); });
  }, []);

  // ── Load from Google Sheet on mount ──────────────────────────────────
  useEffect(() => {
    if (!SCRIPT_URL) {
      console.warn("No SCRIPT_URL — loading sample grants");
      setGrants(sampleGrants);
      setLoading(false);
      return;
    }
    console.log("Fetching from sheet...");
    fetch(SCRIPT_URL, { redirect: "follow" })
      .then(r => r.text())
      .then(text => {
        console.log("Sheet load response:", text.slice(0, 300));
        let data;
        try { data = JSON.parse(text); }
        catch { throw new Error("Non-JSON: " + text.slice(0, 200)); }
        if (data.success && Array.isArray(data.grants) && data.grants.length > 0) {
          // Sanitize: skip blank rows, normalize deadline to YYYY-MM-DD
          const clean = data.grants
            .filter(g => g && g.id && g.title)
            .map(g => ({
              ...g,
              deadline: normalizeDate(g.deadline),
              category: g.category || "",
            }));
          console.log("Loaded grants:", clean.length, "of", data.grants.length);
          setGrants(clean.length > 0 ? clean : sampleGrants);
          setLastUpdated(new Date().toISOString());
        } else {
          console.log("Sheet empty — seeding defaults");
          setGrants(sampleGrants);
          setTimeout(() => saveToSheet(sampleGrants), 800);
        }
      })
      .catch(err => {
        console.error("Load error:", err);
        try {
          const raw = localStorage.getItem("bme-grants-fallback");
          if (raw) { setGrants(JSON.parse(raw)); return; }
        } catch {}
        setGrants(sampleGrants);
      })
      .finally(() => setLoading(false));
  }, [saveToSheet]);

  // ── CRUD handlers ─────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.title || !form.deadline) return;
    const updated = editingId
      ? grants.map(g => g.id === editingId ? { ...form, id: editingId } : g)
      : [...grants, { ...form, id: Date.now().toString() }];
    setGrants(updated);
    saveToSheet(updated);
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (g) => { setForm({ ...g }); setEditingId(g.id); setShowForm(true); setExpandedId(null); };
  const handleDuplicate = (g) => { setForm({ ...g, id: Date.now().toString(), title: g.title + " (Copy)", deadline: "" }); setEditingId(null); setShowForm(true); setExpandedId(null); };
  const handleDelete = (id) => { const u = grants.filter(g => g.id !== id); setGrants(u); saveToSheet(u); setConfirmDelete(null); };

  // ── Filtering / sorting ───────────────────────────────────────────────
  const windowEnd = new Date(); windowEnd.setDate(windowEnd.getDate() + windowMonths * 30);
  const agencies = ["All", ...Array.from(new Set(grants.map(g => g.agency?.split(/[\s/]/)[0]).filter(Boolean)))];
  const usedCategories = ["All", ...CATEGORIES.filter(c => grants.some(g => g.category === c))];
  const urgentCount = grants.filter(g => { const d = getDaysUntil(g.deadline); return d >= 0 && d <= 14; }).length;

  const filtered = grants
    .filter(g => { const d = getDaysUntil(g.deadline); return d >= -7 && new Date(g.deadline) <= windowEnd; })
    .filter(g => filterAgency === "All" || g.agency?.includes(filterAgency))
    .filter(g => filterCategory === "All" || g.category === filterCategory)
    .filter(g => [g.title, g.agency, g.mechanism, g.notes, g.category].join(" ").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "deadline" ? new Date(a.deadline) - new Date(b.deadline) : sortBy === "agency" ? a.agency?.localeCompare(b.agency) : a.title?.localeCompare(b.title));

  // ── Styles ────────────────────────────────────────────────────────────
  const selStyle = { background:"#0d1f35", border:"1px solid #1e3a5f", borderRadius:7, color:"#c9d8ed", padding:"7px 14px", fontSize:13, fontFamily:"inherit", outline:"none" };
  const inpStyle = (extra={}) => ({ background:"#0d1828", border:"1px solid #1e3a5f", borderRadius:8, color:"#c9d8ed", padding:"9px 12px", fontSize:13, fontFamily:"inherit", outline:"none", width:"100%", boxSizing:"border-box", colorScheme:"dark", ...extra });
  const btnStyle = (bg, br, tc) => ({ background:bg, border:`1px solid ${br}`, borderRadius:8, color:tc, padding:"9px 22px", cursor:"pointer", fontFamily:"inherit", fontSize:14 });

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117", color:"#e6edf3", fontFamily:"'Georgia', serif" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#0a1628 0%,#112244 60%,#0d1a35 100%)", borderBottom:"1px solid #1e3a5f", padding:"28px 40px 24px", position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 24px rgba(0,0,0,.5)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:"0.18em", color:"#5b8fc9", textTransform:"uppercase", marginBottom:4 }}>UT Southwestern Medical Center</div>
              <h1 style={{ margin:0, fontSize:26, fontWeight:"normal", color:"#e8f0fb" }}>Department of Biomedical Engineering</h1>
              <div style={{ fontSize:14, color:"#7a9fc9", marginTop:4, fontStyle:"italic" }}>Grant Deadline Tracker — Research Director Dashboard</div>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              {urgentCount > 0 && <div style={{ background:"#3d1a1a", border:"1px solid #c94a4a", borderRadius:8, padding:"6px 14px", fontSize:13, color:"#ff8a8a" }}>⚠ {urgentCount} deadline{urgentCount > 1 ? "s" : ""} within 14 days</div>}
              <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }} style={{ background:"#1a4a8a", border:"1px solid #2a6ac0", borderRadius:8, color:"#a8d0ff", padding:"8px 20px", cursor:"pointer", fontSize:14, fontFamily:"inherit" }}>+ Add Opportunity</button>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display:"flex", gap:12, marginTop:20, flexWrap:"wrap", alignItems:"center" }}>
            <input placeholder="Search grants..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...selStyle, width:180 }} />
            <select value={filterAgency} onChange={e => setFilterAgency(e.target.value)} style={selStyle}>{agencies.map(a => <option key={a}>{a}</option>)}</select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={selStyle}>{usedCategories.map(c => <option key={c}>{c}</option>)}</select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selStyle}>
              <option value="deadline">Sort: Deadline</option>
              <option value="agency">Sort: Agency</option>
              <option value="title">Sort: Title</option>
            </select>
            <select value={windowMonths} onChange={e => setWindowMonths(Number(e.target.value))} style={selStyle}>
              <option value={1}>Window: 1 month</option>
              <option value={3}>Window: 3 months</option>
              <option value={6}>Window: 6 months</option>
              <option value={12}>Window: 12 months</option>
              <option value={24}>Window: 24 months</option>
              <option value={36}>Window: 36 months</option>
            </select>
            <div style={{ fontSize:11, marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
              {loading && <span style={{ color:"#5b8fc9" }}>Loading from Sheet…</span>}
              {!loading && syncStatus === "saving" && <span style={{ color:"#ffd166" }}>⟳ Saving to Sheet…</span>}
              {!loading && syncStatus === "saved"  && <span style={{ color:"#6aaa64" }}>✓ Saved to Sheet</span>}
              {!loading && syncStatus === "error"  && <span style={{ color:"#ff6b6b" }}>⚠ Save failed — check connection</span>}
              {!loading && syncStatus === "idle" && lastUpdated && <span style={{ color:"#4a7a9b" }}>Last synced: {new Date(lastUpdated).toLocaleString()}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 40px" }}>

        {/* Summary stats */}
        <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
          {[
            { label:"Showing", value:`${filtered.length} opportunities`, color:"#5b8fc9" },
            { label:"Within 14 days", value:filtered.filter(g => { const d=getDaysUntil(g.deadline); return d>=0&&d<=14; }).length, color:"#ff6b6b" },
            { label:"Within 30 days", value:filtered.filter(g => { const d=getDaysUntil(g.deadline); return d>=0&&d<=30; }).length, color:"#ffd166" },
            { label:"30d+", value:filtered.filter(g => getDaysUntil(g.deadline)>30).length, color:"#6aaa64" },
          ].map(s => (
            <div key={s.label} style={{ background:"#111c2e", border:"1px solid #1e3a5f", borderRadius:10, padding:"12px 20px", minWidth:130 }}>
              <div style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em" }}>{s.label}</div>
              <div style={{ fontSize:22, fontWeight:"bold", color:s.color, marginTop:2 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Grant cards */}
        {filtered.length === 0
          ? <div style={{ textAlign:"center", color:"#4a7a9b", padding:"60px 0", fontSize:16 }}>No grant opportunities in the selected window.<br /><span style={{ fontSize:13 }}>Expand the time window or add a new opportunity.</span></div>
          : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {filtered.map(grant => {
                const days = getDaysUntil(grant.deadline);
                const urgency = urgencyLabel(days);
                const isExpanded = expandedId === grant.id;
                const ac = getAgencyColor(grant.agency);
                const cs = grant.category ? getCategoryStyle(grant.category) : null;
                return (
                  <div key={grant.id} style={{ background:"#111c2e", border:"1px solid #1e3a5f", borderLeft:`4px solid ${ac}`, borderRadius:12, overflow:"hidden", boxShadow:isExpanded ? `0 0 0 1px ${ac}44` : "none" }}>

                    {/* Card row */}
                    <div onClick={() => setExpandedId(isExpanded ? null : grant.id)} style={{ padding:"18px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <div style={{ background:ac+"22", border:`1px solid ${ac}55`, borderRadius:6, padding:"3px 10px", fontSize:11, color:ac, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                        {grant.agency?.split(/[\s/]/)[0] || "—"}
                      </div>
                      {cs && (
                        <div style={{ background:cs.bg, border:`1px solid ${cs.color}55`, borderRadius:6, padding:"3px 10px", fontSize:11, color:cs.color, whiteSpace:"nowrap" }}>
                          {grant.category}
                        </div>
                      )}
                      <div style={{ flex:1, minWidth:200 }}>
                        <div style={{ fontSize:16, color:"#d4e4f9" }}>{grant.title}</div>
                        {grant.mechanism && <div style={{ fontSize:12, color:"#5b8fc9", marginTop:2 }}>{grant.mechanism}{grant.agency ? ` · ${grant.agency}` : ""}</div>}
                      </div>
                      {grant.amount && <div style={{ fontSize:13, color:"#7aaa6a", whiteSpace:"nowrap", maxWidth:200, textAlign:"right" }}>{grant.amount}</div>}
                      <div style={{ textAlign:"right", whiteSpace:"nowrap" }}>
                        <div style={{ fontSize:14, color:"#c9d8ed" }}>{formatDate(grant.deadline)}</div>
                        <div style={{ marginTop:3, display:"inline-block", background:urgency.bg, color:urgency.color, borderRadius:5, padding:"2px 10px", fontSize:11 }}>
                          {days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? "TODAY" : `${days}d · ${urgency.label}`}
                        </div>
                      </div>
                      <div style={{ color:"#4a7a9b", fontSize:18 }}>{isExpanded ? "▲" : "▼"}</div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div style={{ borderTop:"1px solid #1e3a5f", padding:"18px 22px", background:"#0d1828" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 32px", marginBottom:14 }}>
                          {[
                            ["Full Agency", grant.agency],
                            ["Mechanism", grant.mechanism],
                            ["Award Amount", grant.amount],
                            ["PI Eligibility", grant.piEligible],
                            ["Category", grant.category],
                          ].map(([label, val]) => val ? (
                            <div key={label}>
                              <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a7a9b", marginBottom:2 }}>{label}</div>
                              <div style={{ fontSize:14, color:"#c9d8ed" }}>{val}</div>
                            </div>
                          ) : null)}
                        </div>
                        {grant.notes && (
                          <div style={{ marginBottom:12 }}>
                            <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a7a9b", marginBottom:4 }}>Notes</div>
                            <div style={{ fontSize:14, color:"#a8c0d8", lineHeight:1.6 }}>{grant.notes}</div>
                          </div>
                        )}
                        <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap" }}>
                          {grant.url && <a href={grant.url} target="_blank" rel="noopener noreferrer" style={{ background:"#0d1f35", border:"1px solid #1e3a5f", borderRadius:6, color:"#5b8fc9", padding:"6px 14px", fontSize:12, textDecoration:"none" }}>↗ Funding Announcement</a>}
                          <button onClick={() => handleEdit(grant)} style={{ background:"#0d1f35", border:"1px solid #1e3a5f", borderRadius:6, color:"#8ab4d4", padding:"6px 14px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>✎ Edit</button>
                          <button onClick={() => handleDuplicate(grant)} style={{ background:"#0d1f35", border:"1px solid #1e3a5f", borderRadius:6, color:"#a8c49a", padding:"6px 14px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>⧉ Duplicate</button>
                          <button onClick={() => setConfirmDelete(grant.id)} style={{ background:"#1a0d0d", border:"1px solid #5a2020", borderRadius:6, color:"#c96060", padding:"6px 14px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>✕ Remove</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        }
      </div>

      {/* ── Confirm delete ── */}
      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#111c2e", border:"1px solid #c94a4a", borderRadius:14, padding:"32px 36px", maxWidth:380, textAlign:"center" }}>
            <div style={{ fontSize:20, color:"#e8d0d0", marginBottom:10 }}>Remove this opportunity?</div>
            <div style={{ fontSize:13, color:"#7a9aaa", marginBottom:24 }}>This cannot be undone.</div>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button onClick={() => setConfirmDelete(null)} style={btnStyle("#0d1828","#1e3a5f","#8ab4d4")}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={btnStyle("#3d1a1a","#c94a4a","#ff8a8a")}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit modal ── */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#0f1c30", border:"1px solid #1e3a5f", borderRadius:16, padding:"32px 36px", width:"100%", maxWidth:620, maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ margin:"0 0 22px", fontSize:20, color:"#d4e4f9", fontWeight:"normal" }}>{editingId ? "Edit Funding Opportunity" : "Add Funding Opportunity"}</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

              {/* Title */}
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} placeholder="e.g. NIH R01 – Neural Prosthetics" style={inpStyle()} />
              </div>

              {/* Agency */}
              <div>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Funding Agency *</label>
                <input value={form.agency} onChange={e => setForm(f => ({ ...f, agency:e.target.value }))} placeholder="e.g. NIH / NIBIB" style={inpStyle()} />
              </div>

              {/* Mechanism */}
              <div>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Mechanism</label>
                <input value={form.mechanism} onChange={e => setForm(f => ({ ...f, mechanism:e.target.value }))} placeholder="e.g. R01, CAREER, R21" style={inpStyle()} />
              </div>

              {/* Deadline */}
              <div>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Deadline *</label>
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline:e.target.value }))} style={inpStyle()} />
              </div>

              {/* Amount */}
              <div>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Award Amount</label>
                <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount:e.target.value }))} placeholder="e.g. $500,000" style={inpStyle()} />
              </div>

              {/* PI Eligibility */}
              <div>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>PI Eligibility</label>
                <input value={form.piEligible} onChange={e => setForm(f => ({ ...f, piEligible:e.target.value }))} placeholder="e.g. Early-career faculty" style={inpStyle()} />
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category:e.target.value }))} style={{ ...inpStyle(), cursor:"pointer" }}>
                  <option value="">— Select category —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* URL */}
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>URL / FOA Link</label>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url:e.target.value }))} placeholder="https://..." style={inpStyle()} />
              </div>

              {/* Notes */}
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:11, color:"#4a7a9b", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes:e.target.value }))} placeholder="LOI dates, special requirements…" rows={3} style={{ ...inpStyle(), resize:"vertical" }} />
              </div>

            </div>
            <div style={{ display:"flex", gap:12, marginTop:22, justifyContent:"flex-end" }}>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }} style={btnStyle("#0d1828","#1e3a5f","#8ab4d4")}>Cancel</button>
              <button onClick={handleSave} disabled={!form.title || !form.deadline} style={btnStyle(form.title&&form.deadline?"#1a4a8a":"#0d1828", form.title&&form.deadline?"#2a6ac0":"#1e3a5f", form.title&&form.deadline?"#a8d0ff":"#4a6a8a")}>
                {editingId ? "Save Changes" : "Add Opportunity"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
