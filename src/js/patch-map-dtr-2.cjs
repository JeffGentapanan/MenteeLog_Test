const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const startStr = "<div>${panel('',`<div style=\"background: #FDFBF7;";
const endStr = "</div>`)}";

const startIndex = content.indexOf(startStr);
if (startIndex !== -1) {
  const endIndex = content.indexOf(endStr, startIndex);
  if (endIndex !== -1) {
    const interactiveMapHtml = `
<div class="dtr-widget-container" style="position:relative; width: 100%; height: 460px; border-radius: 24px; overflow: hidden; background: #e0e7ff; box-shadow: 0 20px 40px rgba(88,17,26,0.08); border: 1px solid rgba(88,17,26,0.1); margin-bottom: 24px;">
  <style>
    .dtr-map-bg {
      position: absolute; inset: 0; 
      background-image: url('data:image/svg+xml,%3Csvg width=\\'100\\'%25 height=\\'100\\'%25 xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cdefs%3E%3Cpattern id=\\'grid\\' width=\\'60\\' height=\\'60\\' patternUnits=\\'userSpaceOnUse\\'%3E%3Cpath d=\\'M 60 0 L 0 0 0 60\\' fill=\\'none\\' stroke=\\'rgba(88,17,26,0.08)\\' stroke-width=\\'1\\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\\'100\\'%25 height=\\'100\\'%25 fill=\\'%23FAF4E8\\'/%3E%3Crect width=\\'100\\'%25 height=\\'100\\'%25 fill=\\'url(%23grid)\\'/%3E%3C/svg%3E');
      transition: all 0.5s ease;
      z-index: 1;
    }
    .dtr-map-blur {
      backdrop-filter: blur(6px);
      position: absolute; inset: 0; z-index: 2;
    }
    .dtr-clocked-in .dtr-map-bg { filter: none; }
    .dtr-clocked-in .dtr-map-blur { display: none; }
    .dtr-pulse {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
      width: 300px; height: 300px; border-radius: 50%; 
      background: radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%); 
      animation: mapPulse 3s infinite;
    }
    @keyframes mapPulse { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }

    .dtr-widget-container:has(button[data-action="clock"]:disabled) .dtr-scanner {
       display: flex !important;
    }
    .dtr-widget-container:has(button[data-action="clock"]:disabled) .dtr-map-blur {
       display: none;
    }
    .dtr-widget-container:has(button[data-action="clock"]:disabled) button {
       animation: buttonBlink 1s infinite alternate;
    }
    @keyframes buttonBlink { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.8; } }
    @keyframes radarSpin { 100% { transform: rotate(360deg); } }
  </style>

  <div class="dtr-map-bg">
    \${shift ? '<div class="dtr-pulse"></div><div class="dtr-pulse" style="animation-delay:1.5s;"></div>' : ''}
    <div class="dtr-scanner" style="display:none; position:absolute; inset:0; background:rgba(250,244,232,0.6); backdrop-filter:blur(2px); z-index:3; align-items:center; justify-content:center; flex-direction:column;">
       <div style="width:140px; height:140px; border-radius:50%; border:2px solid rgba(88,17,26,0.2); position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:100%; height:100%; border-radius:50%; border-top: 6px solid #58111A; border-right: 6px solid transparent; animation: radarSpin 1s linear infinite;"></div>
          \${icon('pin')}
       </div>
       <strong style="color:#58111A; margin-top:24px; font-size:20px; font-weight:800; text-shadow:0 2px 4px rgba(255,255,255,1);">Scanning Live GPS...</strong>
    </div>
  </div>
  \${!shift ? '<div class="dtr-map-blur"></div>' : ''}

  <div style="position:absolute; inset:0; z-index:10; display:flex; flex-direction:column; padding: 32px; justify-content: \${!shift ? 'center' : 'space-between'}; align-items: center;">
    \${!shift ? \`
      <!-- PRE-SHIFT OVERLAY -->
      <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(16px); padding: 40px; border-radius: 24px; box-shadow: 0 16px 40px rgba(0,0,0,0.1); text-align: center; border: 1px solid rgba(255,255,255,1); width: 100%; max-width: 360px;">
         <div style="background:#FDFBF7; width:72px; height:72px; border-radius:20px; display:flex; align-items:center; justify-content:center; margin: 0 auto 24px; color:#58111A; font-size:36px; box-shadow:0 8px 16px rgba(88,17,26,0.1);">\${icon('pin')}</div>
         <h2 style="color: #4A1521; font-size: 26px; margin-bottom: 8px; font-weight:800;">Ready for Shift</h2>
         <p style="color: #64748B; margin-bottom: 32px; font-size:15px; line-height:1.5;">Ensure you are physically at<br><strong style="color:#1E293B;">\${e(u().company||'your assigned workplace')}</strong></p>
         \${b('Clock In with GPS', 'clock', '', 'primary full', 'clock', 'style="height: 64px; font-size: 18px; border-radius: 32px; background: #58111A; color: white; border: none; box-shadow: 0 8px 24px rgba(88,17,26,0.3); transition: all 0.2s;"')}
         <p style="font-size: 13px; color: #94A3B8; margin-top: 20px;">Live location scan starts immediately.</p>
      </div>
    \` : \`
      <!-- POST-SHIFT OVERLAY -->
      <div style="width: 100%; display: flex; justify-content: space-between; align-items: flex-start;">
         <div style="background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 10px 16px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,1); display: flex; align-items: center; gap: 10px;">
            <span style="display:inline-block; width:12px; height:12px; background:#059669; border-radius:50%; box-shadow: 0 0 12px rgba(5,150,105,0.6); animation: buttonBlink 2s infinite alternate;"></span>
            <strong style="color: #1E293B; font-size: 14px;">Live GPS Lock</strong>
         </div>
         <div style="background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 10px 16px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,1); text-align: right;">
            <strong style="color: #4A1521; font-size: 14px;" id="dtr-loc-name">\${e(u().company||'Assigned workplace')}</strong>
         </div>
      </div>

      <div style="background: rgba(255,255,255,0.95); backdrop-filter: blur(16px); padding: 32px 48px; border-radius: 32px; box-shadow: 0 20px 48px rgba(0,0,0,0.12); text-align: center; border: 1px solid rgba(255,255,255,1); width: 100%; max-width: 420px; margin-bottom: 16px;">
         <div style="display:inline-block; background:rgba(88,17,26,0.06); color:#58111A; padding:6px 16px; border-radius:24px; font-size:12px; font-weight:700; letter-spacing:1px; margin-bottom:12px;">\${date(today())}</div>
         <div class="timer" id="shift-timer" style="font-size: 72px; font-weight: 800; color: #1E293B; font-variant-numeric: tabular-nums; line-height: 1; letter-spacing: -3px; margin: 8px 0 32px; text-shadow: 0 4px 16px rgba(0,0,0,0.06);">\${shift?elapsed(shift.clockIn,shift.clockOut):'00:00:00'}</div>
         \${b(shift?.clockOut?'Submit Daily Log':'Clock Out', shift?.clockOut?'ref-submit-log':'ref-clock-out', '', 'primary full', 'clock', 'style="height: 64px; font-size: 18px; font-weight:700; border-radius: 32px; background: #E11D48; color: white; border: none; box-shadow: 0 12px 24px rgba(225,29,72,0.3); transition: all 0.2s;"')}
      </div>
    \`}
  </div>
  
  <div style="display:none;">
    <span id="dtr-coords"></span><span id="dtr-acc"></span><span id="dtr-status"></span><div id="dtr-map-frame"></div>
  </div>
</div>
`;

    content = content.substring(0, startIndex) + "<div>" + interactiveMapHtml + content.substring(endIndex + 9);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Interactive map DTR widget successfully installed!');
  } else {
    console.log('End index not found.');
  }
} else {
  console.log('Start index not found.');
}
