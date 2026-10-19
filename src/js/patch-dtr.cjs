const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /<span class="eyebrow">TODAY[\s\S]*?<\/details><\/div>/;
const match = content.match(regex);

if (match) {
  const newDtrHtml = `
<div style="text-align:center; padding: 12px 0;">
  <span class="badge" style="background:#EAE3D4; color:#58111A; font-weight:700; letter-spacing:1px; margin-bottom:16px;">TODAY · \${date(today())}</span>
  <div class="timer" id="shift-timer" style="font-size:64px; font-weight:800; color:#4A1521; margin:8px 0; letter-spacing:-1px;">\${shift?elapsed(shift.clockIn,shift.clockOut):'00:00:00'}</div>
  <p style="color:#475569; font-size:15px; font-weight:600; margin-bottom:24px;">\${shift?.clockOut?'Clocked out — daily log ready to submit':shift?'You are currently clocked in':'Not clocked in'}</p>
  \${b(shift?.clockOut?'Submit Daily Log':shift?'Clock Out':'Clock In with GPS',shift?.clockOut?'ref-submit-log':shift?'ref-clock-out':'clock','','primary full','clock', 'style="height:56px; font-size:16px; font-weight:700; border-radius:12px; background:#58111A; border:none;"')}
</div>
<div class="location-panel" style="background:#FDFBF7; border:1px solid #E2E8F0; border-radius:16px; padding:24px; margin-top:24px;">
  <div style="background:#F2ECE4; border-radius:12px; padding:16px; text-align:center; margin-bottom:16px; border:1px solid rgba(0,0,0,0.05);">
    <p style="margin:0; font-weight:700; color:#166534; font-size:13px; margin-bottom:12px; display:flex; align-items:center; justify-content:center; gap:6px;">\${icon('check')} Live Coordinates Locked</p>
    <div id="dtr-map-frame" class="reference-map" role="img" aria-label="Illustrated map; not a live verification map" style="width:100%; height:120px; background:#4A1521; border-radius:8px; opacity:0.9; box-shadow:inset 0 2px 8px rgba(0,0,0,0.2);"></div>
  </div>
  <div style="text-align:center;">
    <strong style="color:#4A1521; font-size:16px;">\${icon('pin')} <span id="dtr-loc-name">\${e(u().company||'Assigned workplace')}</span></strong><br>
    <small class="muted" id="dtr-coords" style="font-size:13px; display:block; margin-top:6px; font-weight:500;">Coordinates: Pending...</small>
  </div>
  <details style="margin-top:20px; background:#EAE3D4; border-radius:8px; padding:12px; border:1px solid rgba(0,0,0,0.05);">
    <summary style="font-weight:600; font-size:13px; color:#4A1521; cursor:pointer;">Location Details</summary>
    <div class="row between mt8" style="margin-top:12px;"><span class="muted small" style="color:#475569;">Accuracy</span><strong class="small" id="dtr-acc" style="color:#1E293B;">...</strong></div>
    <div class="row between mt8"><span class="muted small" style="color:#475569;">Status</span><strong class="small" id="dtr-status" style="color:#166534;">Searching...</strong></div>
    <p style="margin-top:12px; font-size:12px; color:#475569; text-align:center; line-height:1.4;">\${shift?.gps?'Coordinates captured on this device. Server verification pending.':'No verified location available.'}</p>
  </details>
</div>`.trim();

  content = content.replace(regex, newDtrHtml);
  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('DTR Clock-in widget updated successfully.');
} else {
  console.log('Regex match failed.');
}
