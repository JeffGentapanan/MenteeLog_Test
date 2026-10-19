const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetLine = "return heading('Daily Time Record Hub','Log your attendance, submit daily accomplishments, and review your time records.',b('Export Log Summary','ref-export-modal','','secondary','download'))+stats([['Total Rendered Hours',hrs+' Hours'],['Required Hours',u().requiredHours+' Hours'],['Remaining Hours',Math.max(0,u().requiredHours-hrs)+' Hours']])+`<div class=\"reference-dtr ref-student-dtr\"><div>";

if (!content.includes(targetLine)) {
    console.log("Could not find the target line!");
    process.exit(1);
}

const replacement = `
    const shiftStr = shift ? 'Clocked in at ' + time(shift.clockIn) : 'Not clocked in';
    const shiftBadgeHtml = shift ? '<span class="badge" style="background:var(--burgundy);color:white">Active</span>' : '<span class="badge" style="background:#f1f5f9;color:#334155">Inactive</span>';

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];
    const weeklyLogs = logs.filter(l => l.date >= startOfWeek && l.status === 'Approved');
    const weeklyHours = weeklyLogs.reduce((sum, l) => sum + l.hours, 0);
    const weeklyPct = Math.min(100, Math.round((weeklyHours / 40) * 100)) || 0;

    const totalPct = Math.min(100, Math.round((hrs / u().requiredHours) * 100)) || 0;

    const customStatsHtml = \`<div class="ref-stats">
      <div class="card" style="padding: 26px; border-radius: 12px; border: 1px solid var(--line);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <span style="color:var(--muted); font-size:14px; font-weight: 500;">Current Shift Status</span>
          \${shiftBadgeHtml}
        </div>
        <div style="font-size: 22px; font-weight: 700; color: var(--ink);">\${shiftStr}</div>
      </div>
      <div class="card" style="padding: 26px; border-radius: 12px; border: 1px solid var(--line);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <span style="color:var(--muted); font-size:14px; font-weight: 500;">Hours Rendered This Week</span>
          <span class="badge" style="background:#f1f5f9;color:#334155">\${weeklyPct}% Done</span>
        </div>
        <div style="font-size: 22px; font-weight: 700; color: var(--ink);">\${weeklyHours.toFixed(1)} / 40.0 Hours</div>
      </div>
      <div class="card" style="padding: 26px; border-radius: 12px; border: 1px solid var(--line);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <span style="color:var(--muted); font-size:14px; font-weight: 500;">Total Internship Progress</span>
          <span class="badge" style="background:#FCE7F3;color:#9F1239">\${totalPct}% Completed</span>
        </div>
        <div style="font-size: 22px; font-weight: 700; color: var(--ink);">\${hrs.toFixed(1)} / \${u().requiredHours} Hours</div>
      </div>
    </div>\`;

    return heading('Daily Time Record Hub','Log your attendance, submit daily accomplishments, and review your time records.',b('Export Log Summary','ref-export-modal','','secondary','download')) + customStatsHtml + \`<div class="reference-dtr ref-student-dtr"><div>`;

content = content.replace(targetLine, replacement);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully updated DTR stats panel!');
