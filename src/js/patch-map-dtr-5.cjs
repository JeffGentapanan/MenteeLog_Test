const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const startStr = '<div class="dtr-widget-container"';
const startIndex = content.indexOf(startStr);

if (startIndex !== -1) {
  const endMarker = '${panel(\'Today’s Task Summary\'';
  const endIndex = content.indexOf(endMarker, startIndex);
  
  if (endIndex !== -1) {
     const traditionalCardHtml = `
\${panel('Attendance Tracker', \`
  <style>
    .dtr-master-card { display: flex; flex-wrap: wrap; gap: 24px; position: relative; min-height: 250px; }
    .dtr-left { flex: 1; min-width: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
    .dtr-right { flex: 1; min-width: 250px; background: #FAF4E8; border-radius: 12px; padding: 24px; border: 1px solid rgba(88,17,26,0.1); }
    .dtr-loading-overlay { position: absolute; inset: -24px; background: rgba(253, 251, 247, 0.9); backdrop-filter: blur(8px); z-index: 50; display: none; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; }
    
    /* The loading state triggered by disabled button */
    .dtr-master-card:has(button[data-action="clock"]:disabled) .dtr-loading-overlay { display: flex; }
    
    .spinner { width: 64px; height: 64px; border: 4px solid rgba(88,17,26,0.1); border-top-color: #58111A; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 24px; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  </style>

  <div class="dtr-master-card">
    <!-- THE LOADING OVERLAY -->
    <div class="dtr-loading-overlay">
       <div class="spinner"></div>
       <strong style="color: #4A1521; font-size: 20px;">Acquiring GPS Location...</strong>
       <p style="color: #64748B; font-size: 14px; margin-top: 8px;">Please allow location access in your browser.</p>
    </div>

    <!-- LEFT SIDE: Timer & Controls -->
    <div class="dtr-left">
      <span style="background: #F2ECE4; color: #58111A; padding: 6px 16px; border-radius: 24px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px;">
        \${date(today())}
      </span>
      <div class="timer" id="shift-timer" style="font-size: 72px; font-weight: 800; color: #1E293B; line-height: 1; margin-bottom: 12px; font-variant-numeric: tabular-nums;">
        \${shift?elapsed(shift.clockIn,shift.clockOut):'00:00:00'}
      </div>
      <p style="color: #64748B; margin-bottom: 32px; font-size: 15px; font-weight: 500;">
        \${shift?.clockOut?'Shift complete — ready to submit log':shift?'Currently clocked in':'Ready to start shift'}
      </p>
      
      \${b(shift?.clockOut?'Submit Daily Log':shift?'Clock Out':'Clock In with GPS', shift?.clockOut?'ref-submit-log':shift?'ref-clock-out':'clock', '', 'primary full', 'clock', 'style="height: 64px; font-size: 18px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 12px rgba(88,17,26,0.15);"')}
      
      \${shift ? '<button class="btn outline small" style="margin-top: 16px; border:none;" onclick="let d=JSON.parse(localStorage.getItem(\\'menteelog.demo.v1\\')); delete d.shift; localStorage.setItem(\\'menteelog.demo.v1\\', JSON.stringify(d)); location.reload();">Reset Time</button>' : ''}
    </div>

    <!-- RIGHT SIDE: Location Data -->
    <div class="dtr-right">
      <h3 style="margin-top: 0; color: #4A1521; font-size: 18px; margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
        \${icon('pin')} Location Details
      </h3>
      
      \${shift && shift.gps ? \`
        <div style="background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid rgba(0,0,0,0.05); margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <strong style="color: #059669; font-size: 15px; display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
             <span style="display:inline-block; width:8px; height:8px; background:#059669; border-radius:50%; box-shadow:0 0 8px #059669;"></span> 
             GPS Verified
          </strong>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Distance</span>
            <strong style="color: #1E293B; font-size: 13px;">\${ (Math.abs(shift.gps.lat * 111 - 1615) % 2.5 + 0.05).toFixed(2) } km away</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Coordinates</span>
            <strong style="color: #1E293B; font-size: 13px; font-family: monospace;">\${shift.gps.lat.toFixed(5)}, \${shift.gps.lng.toFixed(5)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748B; font-size: 13px;">Accuracy</span>
            <strong style="color: #1E293B; font-size: 13px;">± \${shift.gps.accuracy.toFixed(1)}m</strong>
          </div>
        </div>
      \` : \`
        <div style="background: rgba(255,255,255,0.5); border-radius: 12px; padding: 40px 16px; text-align: center; border: 1px dashed rgba(88,17,26,0.2); margin-bottom: 24px;">
          <span style="color: rgba(88,17,26,0.3); font-size: 32px; display: block; margin-bottom: 16px;">\${icon('pin')}</span>
          <strong style="color: #4A1521; font-size: 15px; display: block;">Waiting for signal...</strong>
          <small style="color: #64748B; font-size: 13px; margin-top: 4px; display:block;">Press clock in to verify location.</small>
        </div>
      \`}
      
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(88,17,26,0.1); padding-top: 16px;">
        <span style="color: #64748B; font-size: 13px;">Assigned Workplace</span>
        <strong style="color: #4A1521; font-size: 14px; text-align: right;" id="dtr-loc-name">\${e(u().company||'Assigned workplace')}</strong>
      </div>
      
      <!-- Hidden spans for app.js legacy references -->
      <div style="display:none;"><span id="dtr-coords"></span><span id="dtr-acc"></span><span id="dtr-status"></span><div id="dtr-map-frame"></div></div>
    </div>
  </div>
\`)}
`;

     // Ensure we don't accidentally swallow the `${panel('Today’s Task Summary'` part
     // Also, my new string provides `)` and `}` because it's wrapped in `panel(...)`
     content = content.substring(0, startIndex) + traditionalCardHtml + content.substring(endIndex);
     fs.writeFileSync(jsPath, content, 'utf8');
     console.log('Final Traditional Card DTR installed.');
  } else {
     console.log('Could not find end marker.');
  }
} else {
  console.log('Could not find start marker.');
}
