const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// We are replacing the previous ugly DTR HTML with an ultra-premium one.
const regex = /<div style="text-align:center; padding: 12px 0;">[\s\S]*?<\/details>\n?<\/div>/;

const premiumDtrHtml = `
<div style="background: #FDFBF7; border-radius: 24px; padding: 40px 32px; text-align: center; box-shadow: 0 20px 40px rgba(88,17,26,0.04); border: 1px solid rgba(88, 17, 26, 0.08); margin: -22px; margin-bottom: 0;">
  <div style="display:inline-block; background:rgba(88,17,26,0.06); color:#58111A; padding:6px 16px; border-radius:24px; font-size:12px; font-weight:700; letter-spacing:1px; margin-bottom:24px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">TODAY · \${date(today())}</div>
  
  <div class="timer" id="shift-timer" style="font-size: 72px; font-weight: 800; color: #1E293B; font-variant-numeric: tabular-nums; line-height: 1; letter-spacing: -2px; margin-bottom: 8px; text-shadow: 0 4px 12px rgba(0,0,0,0.05);">\${shift?elapsed(shift.clockIn,shift.clockOut):'00:00:00'}</div>
  
  <p style="color: #64748B; font-size: 16px; font-weight: 500; margin-bottom: 32px;">\${shift?.clockOut?'Clocked out — daily log ready to submit':shift?'You are currently clocked in':'Not clocked in'}</p>
  
  \${b(shift?.clockOut?'Submit Daily Log':shift?'Clock Out':'Clock In with GPS',shift?.clockOut?'ref-submit-log':shift?'ref-clock-out':'clock','','primary full','clock', 'style="height: 64px; font-size: 18px; font-weight: 700; border-radius: 16px; background: linear-gradient(180deg, #6C1520 0%, #4A1521 100%); color: #ffffff; box-shadow: 0 8px 16px rgba(88,17,26,0.25); border: none; transition: transform 0.2s;"')}
  
  <div class="location-panel" style="margin-top: 32px; background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid rgba(0,0,0,0.06); text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
    <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
      <div id="dtr-map-frame" class="reference-map" role="img" aria-label="Illustrated map" style="width: 64px; height: 64px; border-radius: 12px; background: radial-gradient(circle at center, #F2ECE4 0%, #EAE3D4 100%); border: 1px solid rgba(0,0,0,0.05); flex-shrink: 0; display:flex; align-items:center; justify-content:center; color:#58111A; font-size:24px; box-shadow:inset 0 2px 4px rgba(0,0,0,0.05);">\${icon('pin')}</div>
      <div style="flex: 1; min-width: 0;">
         <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
            <strong style="color: #1E293B; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="dtr-loc-name">\${e(u().company||'Assigned workplace')}</strong>
            <span style="background: #ECFDF5; color: #059669; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; white-space:nowrap; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 2px 4px rgba(5,150,105,0.1);">\${icon('check')} GPS Lock</span>
         </div>
         <small id="dtr-coords" style="color: #64748B; font-size: 12px; display:block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">Coordinates: Pending...</small>
      </div>
    </div>
    
    <details style="background: #F8FAFC; border-radius: 12px; padding: 12px 16px; border: 1px solid #F1F5F9;">
      <summary style="font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; outline: none;">View Technical Details</summary>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #E2E8F0;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
           <span style="color:#64748B; font-size:12px;">Accuracy Level</span>
           <strong id="dtr-acc" style="color:#0F172A; font-size:12px; font-family:ui-monospace, monospace;">...</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
           <span style="color:#64748B; font-size:12px;">Signal Status</span>
           <strong id="dtr-status" style="color:#059669; font-size:12px;">Searching...</strong>
        </div>
        <p style="margin:8px 0 0; font-size:11px; color:#94A3B8; text-align:center;">\${shift?.gps?'Device location captured securely.':'Waiting for location access...'}</p>
      </div>
    </details>
  </div>
</div>`.trim();

if (content.match(regex)) {
  content = content.replace(regex, premiumDtrHtml);
  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('Ultra-premium design applied.');
} else {
  console.log('Regex did not match.');
}
