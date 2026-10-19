const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(path, 'utf8');

const utilCSS = `
/* Layout Utility Classes */
.align-start { align-items: flex-start !important; }
.flex-1 { flex: 1; }
.mt24 { margin-top: 24px; }
.mt16 { margin-top: 16px; }
.mb8 { margin-bottom: 8px; }
.w100 { width: 100%; }
.premium-card { background: #fff; }
`;

if (!content.includes('Layout Utility Classes')) {
  fs.writeFileSync(path, content + '\n' + utilCSS, 'utf8');
}
