const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/reference.css';
let c = fs.readFileSync(path, 'utf8');

// The file should have a :root{...} definition.
// We will replace it entirely.
c = c.replace(
  /:root\{--burgundy:[^}]+}/,
  ':root{--burgundy:#58111A;--ink:#1F2937;--cream:#FAF4E8;--surface:#FAF4E8;--sand:#EFDFBB;--sand-light:#EFDFBB;--line:rgba(88,17,26,0.15);--line-strong:rgba(88,17,26,0.3);--muted:#6B7280}'
);

fs.writeFileSync(path, c);
