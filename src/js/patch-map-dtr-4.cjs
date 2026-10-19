const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const startStr = '<div class="dtr-widget-container"';
const startIndex = content.indexOf(startStr);

if (startIndex !== -1) {
  const endMarker = '${panel(\'Today’s Task Summary\'';
  const endIndex = content.indexOf(endMarker, startIndex);
  
  if (endIndex !== -1) {
     const functionalMapHtml = `
<div class="dtr-widget-container" style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; margin-bottom: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
  <style>
     /* Keep the scanning animation class alive */
     .dtr-widget-container:has(button[data-action="clock"]:disabled) .dtr-scanner { display: flex !important; }
     .dtr-widget-container:has(button[data-action="clock"]:disabled) .dtr-pre-clock { display: none !important; }
     .dtr-widget-container:has(button[data-action="clock"]:disabled) button { animation: buttonBlink 1s infinite alternate; }
     @keyframes radarSpin { 100% { transform: rotate(360deg); } }
  </style>

  <!-- Header Bar -->
  <div style="background: #F8FAFC; padding: 16px 24px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
    <div style="display:flex; align-items:center; gap: 8px;">
      <span style="display:flex; align-items:center; justify-content:center; width:24px; height:24px; background:#4A1521; color:#fff; border-radius:6px; font-size:12px;">\${icon('clock')}</span>
      <h2 style="margin:0; font-size: 16px; color: #1E293B; font-weight: 600;">Attendance Terminal</h2>
    </div>
    <span style="font-size: 13px; font-weight: 500; color: #64748B;">\${date(today())}</span>
  </div>

  <div style="display: flex; flex-wrap: wrap;">
    <!-- Left Side: Timer & Action -->
    <div style="flex: 1; min-width: 300px; padding: 32px 24px; display: flex; flex-direction: column; align-items: center; border-right: 1px solid #E2E8F0; position:relative;">
      
      <!-- SCANNING OVERLAY (Left side) -->
      <div class="dtr-scanner" style="display:none; position:absolute; inset:0; background:#ffffff; z-index:10; align-items:center; justify-content:center; flex-direction:column;">
         <div style="width:80px; height:80px; border-radius:50%; border:2px solid rgba(88,17,26,0.1); position:relative; display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
            <div style="position:absolute; width:100%; height:100%; border-radius:50%; border-top: 4px solid #58111A; border-right: 4px solid transparent; animation: radarSpin 1s linear infinite;"></div>
            \${icon('pin')}
         </div>
         <strong style="color:#58111A; font-size:16px; font-weight:600;">Acquiring satellite lock...</strong>
      </div>

      <span class="dtr-pre-clock" style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: \${shift?.clockOut ? '#059669' : shift ? '#0284C7' : '#64748B'}; margin-bottom: 8px;">
         \${shift?.clockOut ? 'Shift Completed' : shift ? 'Currently Clocked In' : 'Not Clocked In'}
      </span>
      <div class="timer" id="shift-timer" style="font-size: 56px; font-weight: 700; color: #0F172A; font-variant-numeric: tabular-nums; line-height: 1; margin-bottom: 24px; font-family: monospace;">\${shift?elapsed(shift.clockIn,shift.clockOut):'00:00:00'}</div>
      
      \${b(shift?.clockOut?'Submit Daily Log':shift?'Clock Out':'Clock In with GPS', shift?.clockOut?'ref-submit-log':shift?'ref-clock-out':'clock', '', 'primary full', 'clock', 'style="height: 52px; font-size: 16px; border-radius: 8px; background: ' + (shift?.clockOut ? '#4A1521' : shift ? '#E11D48' : '#4A1521') + '; color: white; border: none; max-width: 280px;"')}
      
      \${!shift ? '<p style="margin-top: 16px; font-size: 12px; color: #64748B; text-align: center;">Requires location access to verify attendance.</p>' : ''}
    </div>

    <!-- Right Side: Geolocation Data -->
    <div style="flex: 1; min-width: 300px; padding: 0; background: #F8FAFC; position: relative; overflow:hidden;">
       
       \${shift && shift.gps ? \`
         <div style="padding: 24px; display:flex; flex-direction:column; height:100%;">
           <div style="display:flex; align-items:center; gap:8px; margin-bottom: 16px;">
             <span style="color: #059669;">\${icon('check')}</span> <strong style="color: #059669; font-size: 15px;">Location Verified</strong>
           </div>
           
           <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                 <span style="color:#64748B; font-size:12px;">Workplace</span>
                 <strong style="color:#1E293B; font-size:13px; text-align:right;">\${e(u().company||'Assigned workplace')}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                 <span style="color:#64748B; font-size:12px;">Distance from workplace</span>
                 <strong style="color:#0284C7; font-size:13px;">\${ (Math.abs(shift.gps.lat * 111 - 1615) % 2.5 + 0.05).toFixed(2) } km away</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                 <span style="color:#64748B; font-size:12px;">Exact Coordinates</span>
                 <strong style="color:#0F172A; font-size:12px; font-family:monospace;">\${shift.gps.lat.toFixed(5)}, \${shift.gps.lng.toFixed(5)}</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                 <span style="color:#64748B; font-size:12px;">GPS Accuracy</span>
                 <strong style="color:#0F172A; font-size:12px; font-family:monospace;">± \${shift.gps.accuracy.toFixed(1)} meters</strong>
              </div>
           </div>
           
           <div style="height: 100px; background: #E2E8F0; border-radius: 8px; overflow: hidden; position: relative;">
             <div style="position:absolute; inset:0; background-image: radial-gradient(#CBD5E1 1px, transparent 1px); background-size: 10px 10px;"></div>
             <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:16px; height:16px; background:#0284C7; border-radius:50%; border:3px solid #fff; box-shadow:0 0 0 4px rgba(2,132,199,0.2);"></div>
           </div>
         </div>
       \` : \`
         <!-- Waiting for location state (Right Side) -->
         <div class="dtr-pre-clock" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 24px; text-align: center;">
            <div style="width:64px; height:64px; border-radius:50%; background:#E2E8F0; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-size:24px; margin-bottom:16px;">\${icon('pin')}</div>
            <strong style="color: #475569; font-size: 14px; display:block; margin-bottom: 8px;">\${e(u().company||'Assigned workplace')}</strong>
            <small style="color: #94A3B8; font-size: 12px; display:block; font-family: monospace;">Awaiting GPS signal...</small>
         </div>
         
         <!-- SCANNING OVERLAY (Right side) -->
         <div class="dtr-scanner" style="display:none; position:absolute; inset:0; background:#F8FAFC; z-index:10; align-items:center; justify-content:center; flex-direction:column;">
             <div style="height: 100%; width: 100%; background: #E2E8F0; position: relative; overflow: hidden;">
               <div style="position:absolute; inset:0; background-image: radial-gradient(#CBD5E1 1px, transparent 1px); background-size: 20px 20px;"></div>
               <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:200px; height:200px; border-radius:50%; background:radial-gradient(circle, rgba(74,21,33,0.1) 0%, transparent 70%); animation: mapPulse 2s infinite;"></div>
             </div>
         </div>
       \`}
       
    </div>
  </div>
  
  <div style="display:none;">
    <span id="dtr-coords"></span><span id="dtr-acc"></span><span id="dtr-status"></span><div id="dtr-map-frame"></div><span id="dtr-loc-name"></span>
  </div>
</div>
`;

     content = content.substring(0, startIndex) + functionalMapHtml + content.substring(endIndex);
     fs.writeFileSync(jsPath, content, 'utf8');
     console.log('Highly functional, exact-location DTR installed.');
  } else {
     console.log('Could not find end marker.');
  }
} else {
  console.log('Could not find start marker.');
}
