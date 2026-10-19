const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(path, 'utf8');

const premiumCSS = `
/* =========================================
   PREMIUM PORTAL OVERRIDES (Workspace Only)
   ========================================= */

/* Typography & Headers */
.workspace .page-heading h1 {
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--ink);
  font-size: 32px;
}
.workspace .page-heading p {
  font-size: 15px;
  color: var(--muted);
}

/* Premium Cards */
.workspace .card {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.04);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -4px rgba(0,0,0,0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.workspace .card:hover {
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);
}

/* Top Navbar Glassmorphism */
.top-nav {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 20px -2px rgba(0,0,0,0.03);
}

/* Premium Tables */
.workspace .table-wrap {
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
}
.workspace table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0;
}
.workspace th {
  background: #F8FAFC;
  color: #475569;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.workspace td {
  background: #ffffff;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  color: var(--ink);
  transition: background 0.15s;
}
.workspace tr:last-child td {
  border-bottom: none;
}
.workspace tr:hover td {
  background: #F1F5F9;
}

/* Buttons */
.workspace .btn {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.workspace .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0,0,0,0.08);
}
.top-nav .icon-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--muted);
  transition: all 0.2s;
}
.top-nav .icon-btn:hover {
  background: var(--sand-light);
  color: var(--burgundy);
  border-color: rgba(0,0,0,0.05);
}

/* Inputs & Forms */
.workspace input, .workspace select, .workspace textarea {
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #F8FAFC;
  padding: 12px 16px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.workspace input:focus, .workspace select:focus, .workspace textarea:focus {
  background: #ffffff;
  border-color: var(--burgundy);
  box-shadow: 0 0 0 4px rgba(88,17,26,0.1);
  outline: none;
}

/* Badges */
.workspace .badge, .top-nav .badge {
  border-radius: 9999px;
  padding: 6px 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-size: 11px;
}

/* Stats Cards */
.workspace .stat {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 12px -4px rgba(0,0,0,0.03);
  transition: transform 0.2s ease;
}
.workspace .stat:hover {
  transform: translateY(-2px);
}
.workspace .stat-icon {
  background: var(--sand-light);
  color: var(--burgundy);
  width: 52px;
  height: 52px;
  border-radius: 14px;
}

/* Avatars */
.workspace .avatar, .top-nav .avatar {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 2px solid #ffffff;
  font-weight: 700;
}
`;

// Only append if not already appended
if (!content.includes('PREMIUM PORTAL OVERRIDES')) {
  fs.writeFileSync(path, content + '\n' + premiumCSS, 'utf8');
  console.log('Premium styles appended to styles.css');
} else {
  // Replace the old block if we're iterating
  const parts = content.split('/* =========================================');
  fs.writeFileSync(path, parts[0] + premiumCSS, 'utf8');
  console.log('Premium styles replaced in styles.css');
}
