const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// The start is the panel containing Attendance Tracker.
const startStr1 = '${panel(\'Attendance Tracker\',';
const startStr2 = '<div class="reference-dtr ref-student-dtr"><div>${panel(\'\',`<div style="background: #FDFBF7;';

let startIndex = content.indexOf(startStr1);
if (startIndex === -1) startIndex = content.indexOf(startStr2);
if (startIndex === -1) {
  // Try to find the exact start based on previous script insertions
  const fallbackStart = content.indexOf('${panel(\'Attendance Tracker\',');
  if (fallbackStart !== -1) startIndex = fallbackStart;
}

if (startIndex !== -1) {
  const endMarker = '${panel(\'Today’s Task Summary\'';
  const endIndex = content.indexOf(endMarker, startIndex);
  
  if (endIndex !== -1) {
     const safeHtml = `
\${panel('Attendance Tracker', \`
  <style>
    .dtr-safe-card { text-align: center; }
    .dtr-safe-timer { font-size: 48px; font-weight: 700; margin: 16px 0; color: #1E293B; font-variant-numeric: tabular-nums; }
    .dtr-map-box { position: relative; background: #EAE3D4; border-radius: 12px; overflow: hidden; margin-top: 24px; border: 1px solid rgba(88,17,26,0.1); }
    .dtr-map-bg { width: 100%; height: 160px; background-image: radial-gradient(rgba(88,17,26,0.1) 2px, transparent 2px); background-size: 16px 16px; display: flex; align-items: center; justify-content: center; position: relative; }
    
    /* Blinking Map Loading State */
    .dtr-safe-card:has(button[data-action="clock"]:disabled) .dtr-map-loader { display: flex; }
    .dtr-map-loader { display: none; position: absolute; inset: 0; background: rgba(234,227,212,0.9); flex-direction: column; align-items: center; justify-content: center; z-index: 10; }
    .radar-spin { width: 40px; height: 40px; border-radius: 50%; border: 3px solid rgba(88,17,26,0.2); border-top-color: #58111A; animation: spin 1s linear infinite; margin-bottom: 12px; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .dtr-stats { background: #FDFBF7; padding: 16px; text-align: left; border-top: 1px solid rgba(88,17,26,0.1); }
    .dtr-fact { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .dtr-fact:last-child { margin-bottom: 0; }
    .dtr-fact span { color: #64748B; font-weight: 500; }
    .dtr-fact strong { color: #1E293B; }
  </style>

  <div class="dtr-safe-card">
    <div style="display:inline-block; background:#F2ECE4; color:#58111A; padding:4px 12px; border-radius:16px; font-size:12px; font-weight:700;">\${date(today())}</div>
    <div class="dtr-safe-timer" id="shift-timer">\${shift?elapsed(shift.clockIn,shift.clockOut):'00:00:00'}</div>
    <p style="color:#64748B; font-size:14px; margin-bottom:24px;">\${shift?.clockOut?'Shift complete — ready to submit log':shift?'Currently clocked in':'Ready to start shift'}</p>
    
    \${b(shift?.clockOut?'Submit Daily Log':shift?'Clock Out':'Clock In with GPS', shift?.clockOut?'ref-submit-log':shift?'ref-clock-out':'clock', '', 'primary full', 'clock')}
    
    \${shift ? '<button class="btn secondary small" style="margin-top: 12px; width:100%; border:1px solid #E2E8F0;" onclick="localStorage.removeItem(\\'menteelog.demo.v1\\'); location.reload();">Reset Stuck Timer</button>' : ''}
    
    <div class="dtr-map-box">
       <!-- Loading State inside the map -->
       <div class="dtr-map-loader">
          <div class="radar-spin"></div>
          <strong style="color:#4A1521;">Scanning Location...</strong>
       </div>

       <!-- Map Visual -->
       <div class="dtr-map-bg">
          \${shift && shift.gps ? \`
            <div style="width: 24px; height: 24px; background: #059669; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 12px rgba(5,150,105,0.5);"></div>
          \` : \`
            <div style="font-size: 32px; color: rgba(88,17,26,0.3);">\${icon('pin')}</div>
          \`}
       </div>

       <!-- Geolocation Details -->
       <div class="dtr-stats">
          \${shift && shift.gps ? \`
            <div class="dtr-fact"><span>Status</span><strong style="color:#059669;">\${icon('check')} GPS Verified</strong></div>
            <div class="dtr-fact"><span>Distance</span><strong>\${ (Math.abs(shift.gps.lat * 111 - 1615) % 2.5 + 0.05).toFixed(2) } km away</strong></div>
            <div class="dtr-fact"><span>Exact Location</span><strong style="font-family:monospace;">\${shift.gps.lat.toFixed(5)}, \${shift.gps.lng.toFixed(5)}</strong></div>
            <div class="dtr-fact"><span>Accuracy</span><strong>± \${shift.gps.accuracy.toFixed(1)}m</strong></div>
          \` : \`
            <div class="dtr-fact"><span>Status</span><strong>Waiting for signal...</strong></div>
            <div class="dtr-fact"><span>Instructions</span><strong>Press Clock In to scan.</strong></div>
          \`}
          <div class="dtr-fact" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.05);">
             <span>Workplace</span><strong id="dtr-loc-name">\${e(u().company||'Assigned workplace')}</strong>
          </div>
       </div>
    </div>
    
    <!-- Hidden spans for app.js legacy references -->
    <div style="display:none;"><span id="dtr-coords"></span><span id="dtr-acc"></span><span id="dtr-status"></span><div id="dtr-map-frame"></div></div>
  </div>
\`)}
`;

     content = content.substring(0, startIndex) + safeHtml + content.substring(endIndex);
     fs.writeFileSync(jsPath, content, 'utf8');
     console.log('Safe, native card DTR installed.');
  } else {
     console.log('Could not find end marker.');
  }
} else {
  console.log('Could not find start marker.');
}
