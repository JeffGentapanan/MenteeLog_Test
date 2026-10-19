const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// I need to replace the customStatsHtml I injected earlier.
const regex = /const customStatsHtml = `(?:[^`]+|`(?!;))+`;/;
const newCustomStatsHtml = `const customStatsHtml = \`<div class="ref-stats">
      <div>
        <div class="row between align-start mb0" style="width: 100%; margin-bottom: 4px;">
          <span>Current Shift Status</span>
          \${shiftBadgeHtml}
        </div>
        <strong>\${shiftStr}</strong>
      </div>
      <div>
        <div class="row between align-start mb0" style="width: 100%; margin-bottom: 4px;">
          <span>Hours Rendered This Week</span>
          <div class="badge" style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:600;padding:2px 8px;">\${weeklyPct}% Done</div>
        </div>
        <strong>\${weeklyHours.toFixed(1)} / 40.0 Hours</strong>
      </div>
      <div>
        <div class="row between align-start mb0" style="width: 100%; margin-bottom: 4px;">
          <span>Total Internship Progress</span>
          <div class="badge" style="background:#FCE7F3;color:#9F1239;font-size:11px;font-weight:600;padding:2px 8px;">\${totalPct}% Completed</div>
        </div>
        <strong>\${hrs.toFixed(1)} / \${u().requiredHours} Hours</strong>
      </div>
    </div>\`;`;

// also update the shiftBadgeHtml to use a div instead of span
const oldShiftBadge = "const shiftBadgeHtml = shift ? '<span class=\"badge\" style=\"background:var(--burgundy);color:white\">Active</span>' : '<span class=\"badge\" style=\"background:#f1f5f9;color:#334155\">Inactive</span>';";
const newShiftBadge = "const shiftBadgeHtml = shift ? '<div class=\"badge\" style=\"background:var(--burgundy);color:white;font-size:11px;font-weight:600;padding:2px 8px;\">Active</div>' : '<div class=\"badge\" style=\"background:#f1f5f9;color:#334155;font-size:11px;font-weight:600;padding:2px 8px;\">Inactive</div>';";

if (content.match(regex)) {
    content = content.replace(regex, newCustomStatsHtml);
    content = content.replace(oldShiftBadge, newShiftBadge);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully refined DTR stats layout to match native styles!');
} else {
    console.log("Could not find the customStatsHtml variable.");
    process.exit(1);
}
