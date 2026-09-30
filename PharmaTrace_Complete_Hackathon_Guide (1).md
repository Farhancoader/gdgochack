# **PharmaTrace** 

Complete hackathon guide: problem, solution, competitors, edge cases, and judge answers 

## **What this document is** 

This is a simple, honest guide for presenting PharmaTrace at a hackathon. It includes the questions you raised: what fake/falsified medicine means, whether the product depends on batch numbers, how to handle missing information, what can fail, and how to answer judges clearly. 

## **Project in one sentence** 

**PharmaTrace is a phone-first early-warning tool that helps patients and pharmacists spot suspicious medicine packs by checking package appearance, printed information, pill identity when available, and unusual distribution patterns.** 

## **Problem statement** 

**Patients and pharmacists often cannot quickly tell whether a medicine is genuine, falsified, poorly labelled, or from an unknown source.** Laboratory testing can confirm chemical contents, but it is expensive, slow, and not available at the point where a person buys or consumes a medicine. QR-code systems may be unavailable, copied, or unsupported by a manufacturer. This creates a need for a quick, affordable screening tool that identifies suspicious products and directs users to professional verification. 

### **Simple definition** 

**Falsified or fake medicine** is a medicine deliberately made or labelled to misrepresent its identity, ingredients, manufacturer, or source. It can contain the wrong ingredient, too little active ingredient, no active ingredient, or harmful material. **Generic medicine is not fake:** a generic is a legal, approved version of a medicine that uses the same active ingredient as a brand-name medicine. 

## **The solution** 

A user takes a photo of a medicine box, blister strip, or pill. PharmaTrace analyzes the photo, extracts available text, validates what it can against trusted reference data, and gives a cautious risk result. It is an **early-warning and triage tool** , not a laboratory or a final legal decision-maker. 

### **How PharmaTrace works** 

|Step|What the system does|Why it helps|
|---|---|---|
|1.<br>Capture|Guides the user to take a clear image of the box, blister, or pill.|Poor images are rejected early rather than producing<br>a misleading result.|
|2. Visual<br>check|Aligns the photo with a trusted template; checks logo sharpness,<br>text layout, colours, borders, and print quality.|Catches low-quality copies and packaging anomalies.|
|3. Read<br>text|OCR reads medicine name, strength, dosage form,<br>manufacturer, expiry date, and batch number if visible.|Turns printed evidence into searchable data.|
|4.<br>Validate<br>data|Checks whether the stated manufacturer is known to produce the<br>stated medicine and strength. Batch validation is used only when<br>data is available.|Catches impossible manufacturer-product<br>combinations.|
|5. Pill<br>check|If the pill has an imprint, compares imprint, shape, and colour<br>with a trusted pill-image record.|Can catch a pack whose pill does not match its label.|



PharmaTrace | Complete Hackathon Guide | Page 1 

|Step|What the system does|Why it helps|
|---|---|---|
|6.<br>Location<br>signal|If the user permits it, compares scan location with the expected<br>market or other reports for that product.|Can identify unusual clustering or possible diversion.|
|7. Risk<br>result|Shows “consistent,” “needs review,” or “high risk,” plus the exact<br>reasons.|Avoids misleading binary claims such as “definitely<br>real.”|



## **Core features** 

1. **Package visual AI:** compares the captured pack with an approved reference image. 

2. **OCR extraction:** reads medicine and packaging details automatically. 

3. **Manufacturer-product check:** tests whether the maker, molecule, strength, and dosage form are a plausible combination. 

4. **Optional batch validation:** checks a batch number only when it is visible and a trusted data source exists. 

5. **Pill imprint matching:** compares pill text, colour, and shape when the pill has an imprint. 

6. **Explainable results:** highlights suspicious parts of the pack and explains the missing or inconsistent evidence. 

7. **Risk map:** aggregates consented reports to identify suspicious locations or repeat signals. 

8. **Offline-first option:** stores selected templates and reference data locally, then syncs reports later. 

### **Important design rule** 

**Do not depend on one signal.** The system should still work when a batch number, QR code, pill imprint, internet connection, or exact template is missing. The more independent signals that agree, the stronger the confidence. Missing information should lower confidence—not automatically prove that a medicine is fake. 

PharmaTrace | Complete Hackathon Guide | Page 2 

## **Existing solutions** 

|Existing approach|What it does well|Limitation|
|---|---|---|
|Laboratory testing (HPLC<br>/ mass spectrometry)|Can confirm chemical composition; best final<br>confirmation.|Slow, costly, needs samples, specialists, and<br>equipment.|
|QR / serial-code<br>verification|Fastly checks a code against a record.|Codes can be absent, copied, or not linked to a<br>trusted system.|
|Blockchain traceability|Creates tamper-evident supply-chain records.|Needs manufacturers, distributors, pharmacies,<br>and regulators to participate.|
|Digital watermark or<br>special label|Provides strong authentication when brands add<br>covert packaging features.|Requires packaging changes and manufacturer<br>adoption.|
|Visual AI tools|Detects visual package differences from<br>photographs.|Can miss a high-quality fake with very similar<br>printing.|
|Factory inspection<br>cameras|Checks labels, seals, and blisters before goods<br>leave factories.|Does not help a patient after products enter<br>distribution or informal markets.|



## **What makes PharmaTrace different** 

PharmaTrace combines several useful but incomplete methods into one phone-first screening flow. It does not claim that any one check proves authenticity. Instead, it joins visual evidence, printed-text consistency, manufacturer-product checks, optional batch verification, pill identity, and location-based risk signals. 

|Gap in other solutions|PharmaTrace response|Simple pitch line|
|---|---|---|
|A code may be copied or<br>missing.|Uses visual inspection and product-data consistency<br>checks even without a QR code.|“We do not trust one code alone.”|
|A photo-only system may miss a<br>high-quality copy.|Uses text, manufacturer-product, imprint, and optional<br>batch checks as additional signals.|“The pack must look right and the<br>information must make sense.”|
|Lab confirmation is not instant.|Prioritizes suspicious products for pharmacist, regulator, or<br>laboratory follow-up.|“We are triage before the lab, not a<br>replacement for it.”|
|Enterprise tools focus on<br>factories or brands.|Designs a simple result for patients, pharmacists, clinics,<br>and field inspectors.|“Protection at the point of use.”|
|One region may have poor<br>connectivity.|Can cache selected templates and rules; uploads reports<br>when connectivity returns.|“Designed for imperfect real-world<br>conditions.”|



### **Most honest positioning** 

**“PharmaTrace does not prove what is chemically inside a pill. It identifies packs that deserve closer verification, so pharmacists, regulators, and laboratories can act faster.”** 

## **Batch numbers: the correct approach** 

Batch numbers are helpful but must be **optional** . Many regulated medicine packs should carry a lot or batch number, but it may be missing from a small blister, unreadable, outside the captured frame, or unavailable in a public manufacturer database. Therefore, do not build a rule that says: “No batch number = fake.” Build a rule that says: “Batch evidence unavailable; use other signals and lower confidence.” 

|Batch situation|Correct system behavior|User message|
|---|---|---|
|Batch visible and verified|Use it as a strong positive signal.|“Batch details are consistent with the<br>available record.”|



PharmaTrace | Complete Hackathon Guide | Page 3 

|Batch situation|Correct system behavior|User message|
|---|---|---|
|Batch visible but invalid /<br>inconsistent|Raise risk, especially when visual evidence also differs.|“Batch details do not match available<br>records. Please verify before use.”|
|Batch absent or unreadable|Do not call it fake solely for this reason; move to backup<br>checks.|“Batch details could not be verified.<br>Result is based on other available<br>evidence.”|
|No trusted batch database<br>exists|Use manufacturer-product validation, pill imprint, visual<br>evidence, and user guidance.|“No batch database is available for<br>this product. Verification is limited.”|



### **Two strongest backups** 

**Backup 1 — Pill imprint matching:** if the pill has a visible imprint, compare its letters/numbers, colour, and shape to a pill reference dataset. If the box says one medicine but the pill matches another, that is a strong warning. **Backup 2 — Manufacturer-product validation:** read the manufacturer, medicine name, strength, and dosage form. Check whether that company is known to make that product. A mismatch is suspicious even if no batch number exists. 

PharmaTrace | Complete Hackathon Guide | Page 4 

## **Failure and edge-case playbook** 

A trustworthy project defines what happens when it cannot verify something. In every uncertain case, PharmaTrace should avoid declaring “genuine” and instead explain the limitation and recommend the next safe action. 

#### **Q: What if the medicine is genuine but has no batch number?** 

**Answer:** Do **not** say it is fake. Mark batch evidence as unavailable, run visual, manufacturer-product, imprint, and expiry checks, then return **“needs review”** or **“limited verification”** . Ask the user to scan the outer carton or verify with a pharmacist. 

#### **Q: What if the user scans only a blister strip?** 

**Answer:** Ask whether the outer box is available. If not, inspect the blister printing, expiry, manufacturer, and pill imprint. Clearly state that the result has lower confidence because the carton was not reviewed. 

#### **Q: What if the package photo is blurry, dark, or angled?** 

**Answer:** Reject the image before analysis. Show simple capture guidance: good lighting, no glare, keep text in focus, and include the entire label. Never generate a confident verdict from a poor image. 

#### **Q: What if a sophisticated fake looks identical?** 

**Answer:** This is a known limitation of visual AI. Use additional checks: manufacturer-product validation, batch data where available, imprint matching, and reported-location anomalies. Escalate uncertain cases rather than marking them genuine. 

#### **Q: What if the counterfeit uses a real batch number copied from a genuine pack?** 

**Answer:** A batch check alone may pass. Visual differences, duplicate scans across distant regions, unusual scan patterns, and a pill mismatch can still increase risk. The interface should say that a valid batch code alone does not prove authenticity. 

#### **Q: What if the pill has no imprint?** 

**Answer:** Skip the pill-imprint check without penalizing the medicine solely for that. Use package evidence and manufacturer-product information. State: “Pill identity could not be independently matched.” 

#### **Q: What if the manufacturer database is incomplete?** 

**Answer:** Return “data unavailable,” not “manufacturer mismatch.” Store the case for future review and allow a pharmacist or partner organization to correct the reference record. 

#### **Q: What if a genuine package design changes?** 

**Answer:** Template matching may flag it. Maintain versioned official templates with package-effective dates. If the system sees a new possible layout, return “needs review” rather than “fake.” 

#### **Q: What if internet is unavailable?** 

**Answer:** Run cached visual templates, OCR, and local manufacturer/pill data. Queue reports securely and sync later. Make the screen clear that online checks were not performed. 

#### **Q: What if location permission is denied?** 

**Answer:** Do not collect it. The core scan should still work; only the supply-chain anomaly feature is disabled. 

#### **Q: What if the system falsely flags a genuine medicine?** 

**Answer:** Provide a “report incorrect result” option for pharmacists and verified partners. Review feedback, update templates and records, and use conservative labels such as “needs review,” not “fake.” 

#### **Q: What if the system incorrectly marks a fake as safe?** 

PharmaTrace | Complete Hackathon Guide | Page 5 

**Answer:** Never show “100% genuine.” Use “consistent with available evidence” and show what evidence was missing. Encourage professional confirmation for high-risk medicines or urgent situations. 

#### **Q: What if a user needs medicine urgently?** 

**Answer:** The app must not delay emergency care. Display: “Do not rely on this app for emergency treatment decisions. Contact a clinician, pharmacist, or emergency service.” 

#### **Q: What if someone uploads a photo of another person’s prescription?** 

**Answer:** Minimize stored data, blur/redact personal information where possible, collect only necessary fields, obtain consent for location, and protect uploaded images. 

## **Risk-score design** 

Use a transparent scoring model rather than a black box. Example signals: visual similarity, OCR confidence, manufacturer-product match, expiry-format match, batch result when available, pill-imprint match when available, and geo anomaly when consented. Missing optional information should lower the confidence level but should not automatically create a high-risk alert. 

|Result level|When to use it|Recommended user action|
|---|---|---|
|Consistent with available<br>evidence|Multiple signals match and no major contradiction is<br>found.|Still purchase medicines only from trusted<br>sources; keep packaging.|
|Limited verification / needs<br>review|Important signals are missing, unclear, or<br>unavailable.|Scan the outer box, check with a pharmacist,<br>or contact the manufacturer.|
|High risk / suspicious|Multiple independent signals conflict: visual<br>anomalies, impossible product-maker combination,<br>wrong pill match, or invalid data.|Do not consume until verified by a<br>pharmacist, regulator, manufacturer, or<br>laboratory.|



PharmaTrace | Complete Hackathon Guide | Page 6 

## **Judge questions and strong answers** 

#### **Judge: Is PharmaTrace dependent on batch numbers?** 

**Answer:** No. Batch verification is an optional high-value signal. The core flow still works through packaging visual analysis, manufacturer-product validation, pill imprint matching when available, and explainable confidence levels. 

#### **Judge: Can you prove a medicine is genuine from a photo?** 

**Answer:** No. A photo cannot prove chemical composition. PharmaTrace is a risk-screening and triage tool that identifies packs needing professional or laboratory verification. 

#### **Judge: Why not just use a QR code?** 

**Answer:** QR codes are useful, but they may be missing, copied, or unsupported. We use QR or serial data when available, but we also assess physical packaging and product-data consistency. 

#### **Judge: Why not just use a lab?** 

**Answer:** Laboratories are essential for final confirmation, but they are costly and slow for every pack. PharmaTrace helps prioritize which products should be sent for expert testing. 

#### **Judge: How will you prevent false positives?** 

**Answer:** We avoid a binary “fake/genuine” label. We reject bad photos, use multiple signals, say “limited verification” when evidence is missing, and collect pharmacist feedback to improve references. 

#### **Judge: How will you prevent false negatives?** 

**Answer:** We do not promise certainty. A valid-looking result is phrased as “consistent with available evidence.” High-risk products and uncertain cases are routed to pharmacists, regulators, or labs. 

#### **Judge: What happens without manufacturer data?** 

**Answer:** We use public product records where permitted, manufacturer-product plausibility checks, trusted package templates, and pill-imprint data where available. We clearly label missing data and do not pretend a check occurred. 

#### **Judge: Who is the user?** 

**Answer:** Primary users are pharmacists, clinics, community health workers, customs/field inspectors, and patients buying medicines in environments where verification is difficult. 

#### **Judge: What is the hackathon MVP?** 

**Answer:** Image upload, OCR for medicine/manufacturer/strength, a small trusted product dataset, visual comparison against 2–3 templates, one pill-imprint or product-match check, and a clear “needs review” result screen. 

#### **Judge: What is the long-term business model?** 

**Answer:** Offer a free consumer scan with basic guidance; provide paid dashboards and integrations for pharmacies, distributors, brands, regulators, and public-health organizations—subject to validation, privacy, and regulatory requirements. 

## **Hackathon demo flow** 

1. Show a genuine demo package and a mock suspicious package. 

2. Scan the genuine pack: package visual match, manufacturer-product match, and clear explanation. 

3. Scan the suspicious pack: highlight a shifted logo or blurred print, show a product-data conflict or mismatched pill imprint, and return “high risk—verify before use.” 

4. Show the map/dashboard with a fictional cluster of reports for the same product. 

5. End with the honest statement: “We do not replace lab testing; we help people know when to seek it.” 

PharmaTrace | Complete Hackathon Guide | Page 7 

## **Final pitch** 

**“PharmaTrace turns an ordinary smartphone into an early-warning tool for suspicious medicines. It does not rely on one code or one database: it combines package visual analysis, printed-information validation, optional batch checks, pill identity, and location signals to help pharmacists and patients make safer next-step decisions.”** 

### **Note on responsible claims** 

For the hackathon, use synthetic or clearly labelled mock packages and a mock database unless you have permission to use real brand assets and authoritative data. Do not claim clinical accuracy, regulatory approval, or definitive counterfeit detection without validated studies and formal authorization. 

PharmaTrace | Complete Hackathon Guide | Page 8 

