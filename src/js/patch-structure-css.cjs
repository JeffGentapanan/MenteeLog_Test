const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(path, 'utf8');

const structuralCSS = `
/* =========================================
   NEW PREMIUM DASHBOARD STRUCTURE
   ========================================= */
.dashboard-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 40px 0 32px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  margin-bottom: 32px;
}
.dashboard-hero h1 {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--ink);
  margin: 0 0 8px;
}
.dashboard-hero p {
  font-size: 16px;
  color: var(--muted);
  margin: 0;
}
.hero-actions {
  display: flex;
  gap: 12px;
}
.stat-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
.dashboard-grid-modern {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}
.dash-full {
  grid-column: 1 / -1;
}
@media (max-width: 1100px) {
  .dashboard-grid-modern { grid-template-columns: 1fr; }
  .dashboard-hero { flex-direction: column; align-items: flex-start; gap: 24px; }
}
.card-header {
  border-bottom: 1px solid rgba(0,0,0,0.04);
  padding-bottom: 16px;
  margin-bottom: 16px;
}
.card-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.detail-row:last-child { border-bottom: none; }
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.notice-item {
  background: #F8FAFC;
  padding: 16px;
  border-radius: 10px;
  border-left: 4px solid var(--burgundy);
}
.notice-item.alert {
  border-left-color: #E11D48;
  background: #FFF1F2;
}
.notice-item p { margin: 0 0 4px; font-weight: 500; font-size: 14px; }
.w100 { width: 100%; }
.mb8 { margin-bottom: 8px; }
.progress-bar-modern {
  height: 12px;
  background: rgba(0,0,0,0.05);
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--burgundy);
  border-radius: 999px;
}
.modern-ring {
  width: 120px; height: 120px; flex-shrink: 0;
}
.hero-actions .btn {
  padding: 10px 20px;
  font-size: 14px;
}
.hero-actions .alert-btn {
  background: #FFF1F2;
  color: #E11D48;
  border-color: #E11D48;
}
`;

if (!content.includes('NEW PREMIUM DASHBOARD STRUCTURE')) {
  fs.writeFileSync(path, content + '\n' + structuralCSS, 'utf8');
  console.log('Structural CSS appended to styles.css');
} else {
  console.log('Structural CSS already exists in styles.css');
}
