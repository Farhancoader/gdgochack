# **PharmaTrace: Complete Features List** 

All features grouped by purpose, with simple explanations 

## **Core scanning features** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Package photo capture|User takes a clear photo of the medicine box, blister strip,<br>or pill.|Quick, no special hardware<br>needed.|
|Image-quality check|App rejects blurry, dark, or angled photos before analysis.|Prevents wrong results from bad<br>photos.|
|Visual template<br>comparison|Compares the pack with a trusted reference image.|Catches blurry logos, wrong<br>colours, shifted text.|
|Text extraction (OCR)|Reads medicine name, strength, company, expiry, batch<br>number from the pack.|Turns printed details into data for<br>checks.|
|Pill photo capture|User can also photograph the pill itself.|Adds another layer of identity<br>checking.|



## **Validation and verification features** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Company-product check|Checks whether the named company is known to make<br>that medicine and strength.|Catches impossible combinations.|
|Batch number validation|If a batch number is visible, checks whether it matches<br>expected format and records.|Adds confidence when data exists.|
|Expiry-date check|Reads and validates the expiry date format and logic.|Flags clearly invalid or past dates.|
|Pill imprint matching|Compares pill letters/numbers, shape, and colour with a<br>reference list.|Catches wrong pills inside a box.|
|Location-based risk|If user allows it, compares scan location with expected<br>market or other reports.|Catches batches appearing in<br>unexpected places.|
|Scan-pattern analysis|Looks at how often and where the same batch is scanned.|Catches cloned or diverted<br>batches.|



## **Result and explanation features** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Risk-level result|Shows “consistent,” “needs checking,” or “high risk.”|Clear, non-confusing message.|
|Reason list|Explains exactly what was checked and what looked<br>unusual.|User knows why the app is worried.|
|Highlighted anomalies|Marks suspicious parts of the pack image (blurry logo,<br>wrong text, etc.).|Visual proof, not just words.|
|Confidence indicator|Shows how strong the available evidence is (high,<br>medium, low).|Helps user judge how much to trust<br>the result.|
|“What to do next” advice|Suggests actions: scan again, check outer box, ask a<br>pharmacist, contact company, or avoid use.|Turns a warning into a safe next<br>step.|



PharmaTrace | Features List | Page 1 

## **Data and reference features** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Trusted package<br>templates|Stored reference images of genuine packs for comparison.|Makes visual checks possible.|
|Company-product<br>database|List of which companies make which medicines and<br>strengths.|Supports company-product<br>validation.|
|Pill imprint reference|List of pill codes, shapes, and colours linked to medicines.|Supports pill identity checks.|
|Batch record cache<br>(optional)|Local copy of selected batch data for offline use.|Works even with poor internet.|
|Versioned package<br>designs|Keeps track of old and new pack designs for the same<br>medicine.|Avoids flagging legitimate design<br>changes.|



## **User experience features** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Simple scan screen|One big button to take or upload a photo.|Easy for anyone to use.|
|Guidance overlays|Shows where to place the pack in the camera frame.|Helps user get a good photo.|
|Language support|App text available in multiple local languages.|Accessible to more users.|
|Accessibility options|Large text, high-contrast mode, and screen-reader<br>support.|Helps users with vision or reading<br>difficulties.|
|History view|User can see past scans and results.|Useful for pharmacists or repeat<br>users.|
|Report sharing|User can share a result as a simple report (image or text).|Easy to show a pharmacist or<br>regulator.|



## **Privacy and safety features** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Minimal data collection|Stores only what is needed for the scan and optional<br>reporting.|Protects user privacy.|
|Location permission<br>control|User can deny location; app still works (only location-risk<br>is off).|Gives user choice.|
|Blur or hide prescription<br>details|Option to blur personal information on prescriptions before<br>upload.|Protects sensitive health<br>information.|
|Secure storage|Encrypts stored images and reports on the device.|Reduces risk if the phone is lost or<br>hacked.|
|Clear disclaimers|Explains that the app does not prove chemical content or<br>replace a pharmacist.|Sets correct expectations.|
|Emergency warning|Tells users not to rely on the app for urgent treatment<br>decisions.|Prevents dangerous delays in care.|



## **Offline and low-connectivity features** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Offline visual checks|Uses saved templates to compare packs without internet.|Works in remote areas.|



PharmaTrace | Features List | Page 2 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Local data cache|Stores company-product and pill data on the phone.|Reduces need for constant<br>internet.|
|Queue and sync|Stores reports on the phone and uploads them later when<br>internet returns.|No data lost in poor-connection<br>areas.|
|Lightweight app design|Keeps app size and data usage small.|Better for low-end phones and<br>limited data plans.|



## **Admin and partner features (for future versions)** 

|Feature|Simple meaning|User benefit|
|---|---|---|
|Pharmacist dashboard|Lets pharmacists see multiple scans, trends, and repeated<br>warnings.|Helps professionals spot patterns.|
|Regulator view|Shows maps of suspicious batches and locations.|Helps authorities target<br>inspections.|
|Manufacturer portal|Allows companies to upload official pack templates and<br>correct product records.|Improves accuracy over time.|
|Feedback loop|Pharmacists and partners can flag incorrect results.|System learns and improves<br>reference data.|
|Analytics and reports|Summaries of how many scans, how many high-risk,<br>which products, and where.|Supports public-health planning.|



## **Hackathon MVP features (what to build first)** 

For a 24–48 hour hackathon, focus on a small but complete set: 

|Must-have|Nice-to-have if time permits|
|---|---|
|Photo upload or camera capture|Pill imprint matching|
|Basic OCR for medicine name, strength, company|Location-based risk map|
|One or two trusted package templates|Offline mode|
|Company-product check with a small mock database|History view|
|Simple risk result (consistent / needs checking / high risk)|Report sharing|
|Clear explanation of why a result was given|Language support|
|Basic disclaimer and safety message|Pharmacist dashboard|



## **One-line feature summary** 

**PharmaTrace combines photo-based package checks, text validation, pill identity checks, optional batch verification, and location-risk patterns into one simple phone app that explains clearly when a medicine needs expert checking.** 

PharmaTrace | Features List | Page 3 

