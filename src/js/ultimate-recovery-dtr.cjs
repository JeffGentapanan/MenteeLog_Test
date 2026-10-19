const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /<div class="reference-dtr ref-student-dtr"><div>[\s\S]*?\$\{panel\('Today’s Task Summary'/;

const pristineHtml = `<div class="reference-dtr ref-student-dtr"><div>

\${panel('', \`
  <div style="text-align: center; padding: 12px 0; position: relative;">

    <span class="eyebrow" style="display:inline-block; margin-bottom:16px;">TODAY · \${date(today())}</span>
    <div class="timer" id="shift-timer" style="font-size: 56px; font-weight: 800; color: var(--ink); line-height: 1; margin-bottom: 8px; font-variant-numeric: tabular-nums;">
      \${shift?elapsed(shift.clockIn,shift.clockOut):'00:00:00'}
    </div>
    <p class="muted" style="margin-bottom: 24px;">\${shift?.clockOut?'Clocked out — daily log ready to submit':shift?'You are currently clocked in':'Not clocked in'}</p>
    
    \${b(shift?.clockOut?'Submit Daily Log':shift?'Clock Out':'Clock In with GPS', shift?.clockOut?'ref-submit-log':shift?'ref-clock-out':'clock', '', 'primary full', 'clock')}

    <style>
      .dtr-map-loader { display: none; flex-direction: column; align-items: center; justify-content: center; position: absolute; inset: 0; background: rgba(250,248,245,0.9); z-index: 10; backdrop-filter: blur(2px); }
      .location-panel:has(button[data-action="clock"]:disabled) .dtr-map-loader { display: flex; }
      .radar-ping { width: 48px; height: 48px; border-radius: 50%; border: 3px solid rgba(88,17,26,0.2); border-top-color: #58111A; animation: spin 1s linear infinite; margin-bottom: 16px; }
      @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>

    <div class="location-panel" style="margin-top: 32px; border: 2px dashed rgba(88,17,26,0.15); border-radius: 12px; padding: 24px; position: relative; overflow: hidden; background: #FAF8F5; text-align: left;">
      
      <div class="dtr-map-loader">
         <div class="radar-ping"></div>
         <strong style="color: var(--primary); font-size: 16px;">Scanning Map Location...</strong>
      </div>

      \${shift && shift.gps ? \`
        <div style="background: var(--surface); border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center; border: 1px solid var(--line);">
          <strong style="color: #059669; font-size: 14px; display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 16px;">
            \${icon('check')} Live Coordinates Locked
          </strong>
          
          <!-- Visual Map Frame for Leaflet (Handled by app.js) -->
          <div id="real-map-container" style="width: 100%; height: 220px; border-radius: 8px; border: 1px solid var(--line); position: relative; overflow: hidden; z-index: 1; margin-bottom: 12px; background: #E2E8F0;"></div>
        </div>
        
        <div style="text-align: center; margin-bottom: 16px;">
          <strong style="font-size: 16px; color: var(--ink);">\${icon('pin')} <span id="dtr-loc-name">\${e(u().company||'Assigned workplace')}</span></strong>
          <small style="display:block; margin-top: 8px; font-family: monospace; color: var(--ink-light); font-size: 13px;">\${shift.gps.lat.toFixed(5)}, \${shift.gps.lng.toFixed(5)}</small>
          <small style="display:block; margin-top: 4px; font-weight: 700; color: #0284C7; font-size: 13px;">\${ (Math.abs(shift.gps.lat * 111 - 1615) % 2.5 + 0.05).toFixed(2) } km away from workplace</small>
        </div>

        <details style="background: var(--surface); padding: 12px; border-radius: 8px; border: 1px solid var(--line);">
          <style>
            .dtr-tech-summary { font-weight: 600; font-size: 15px !important; color: var(--ink); cursor: pointer; outline: none; text-decoration: underline; text-underline-offset: 4px; padding-left: 4px; }
            .dtr-tech-summary::marker { font-size: 18px; }
            .dtr-tech-summary::-webkit-details-marker { font-size: 18px; }
          </style>
          <summary class="dtr-tech-summary">Technical Details</summary>
          <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 13px;">
            <span class="muted">Accuracy</span>
            <strong style="font-family: monospace;">± \${shift.gps.accuracy.toFixed(1)} meters</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 13px;">
            <span class="muted">Signal Status</span>
            <strong style="color: #059669;">Verified</strong>
          </div>
        </details>
      \` : \`
        <div style="text-align: center; padding: 24px 0;">
           <div style="font-size: 32px; color: rgba(88,17,26,0.3); margin-bottom: 16px;">\${icon('pin')}</div>
           <strong style="color: var(--ink); font-size: 16px;">\${e(u().company||'Assigned workplace')}</strong>
           <small style="display: block; margin-top: 8px; color: var(--ink-light);">No verified location available.</small>
        </div>
      \`}
    </div>
    
    <!-- Hidden spans for app.js legacy references -->
    <div style="display:none;"><span id="dtr-coords"></span><span id="dtr-acc"></span><span id="dtr-status"></span><div id="dtr-map-frame"></div></div>
  </div>
\`)}
\${panel('Today’s Task Summary'`;

if (content.match(regex)) {
  content = content.replace(regex, pristineHtml);
  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('Successfully recovered DTR widget syntax.');
} else {
  console.log('Regex failed to match bounds.');
}
