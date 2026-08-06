# Warfarin CDSS v2.0

Vanilla JavaScript single-page clinical decision-support prototype based on the supplied implementation plan (version 2026.08.04).

## Run

Open `index.html` directly in a modern browser. No server, build step, package manager, CDN, analytics, or network connection is required.

## Implemented

- Four-step clinical wizard
- CHA₂DS₂-VA and HAS-BLED calculation
- DOAC suitability acknowledgment flow
- INR history with browser persistence
- Rosendaal-style day-level linear interpolation TTR
- SVG INR chart and therapeutic target band
- Safety hard stops for pregnancy, procedures, bleeding, high INR, recent dose changes, and reversible causes
- Versioned guideline target configuration
- Local-protocol-gated maintenance dose proposal
- Seven-day tablet scheduler with half/quarter tablet settings
- Append-only audit entries in localStorage and CSV export
- Print / browser PDF and patient education sheet
- No external dependencies or network requests

## Safety design decisions

- Booster doses, bridging, reversal doses, pregnancy management, peri-procedural plans, INR >=4.5, major bleeding, CRNMB, and markedly subtherapeutic mechanical-valve cases do not produce automatic dosing.
- The pharmacogenomic formula from the implementation plan is displayed as advisory information only. It is not used to calculate the maintenance recommendation.
- The supplied nomogram is treated as a local configurable protocol rather than represented as a verified universal CHEST table. Calculation requires explicit local-protocol acknowledgment.
- Annual stroke/bleeding percentages are not displayed because the supplied plan did not include a validated score-to-risk table.

## Privacy limitation

Browser localStorage is not equivalent to an enterprise clinical database and does not provide encryption, access control, reliable immutability, backup, or multi-user isolation. Do not store directly identifying patient information in this prototype.

## Production prerequisites

Clinical governance approval, source verification, validation against institutional test cases, threat modeling, WCAG audit, formal change control, and integration with authenticated hospital infrastructure are required before patient-care use.

## เพิ่มเติมใน v2.1
- ปฏิทินรับประทานยา 7 วันพร้อมวันที่จริง
- ส่งออกตารางยาเป็นไฟล์ iCalendar (.ics)
- ปุ่มรีเซ็ตข้อมูลผู้ป่วยปัจจุบัน
- ตัวจัดเม็ดแบบ dynamic programming เพื่อลดจำนวนชิ้นและแสดง ½/¼/¾ อย่างชัดเจน

## v2.2 additions

- Three selectable regimen alternatives: balanced recommendation, simpler pattern, and fewer tablet units.
- Tablet visualization for full, half, quarter, and three-quarter tablets.
- Dispensing calculator by days supply, optional buffer days, and patient on-hand inventory.
- Separates tablet-equivalent consumption from whole-tablet quantity to dispense.
- Full supply-period medication calendar and optional daily packet schedule.
- `.ics` export now follows the selected regimen for the requested days supply.

The regimen planner optimizes presentation of an already-authorized weekly dose. It does not create booster doses, bridging regimens, reversal doses, or override clinical safety gates.
