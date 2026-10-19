const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(path, 'utf8');

const globalHeaderCSS = `
/* Global Page Heading Redesign */
.workspace .page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 32px 0 24px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  margin-bottom: 32px;
}
.workspace .page-heading h1 {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--ink);
  margin: 0 0 8px;
}
.workspace .page-heading p {
  font-size: 16px;
  color: var(--muted);
  margin: 0;
}
@media (max-width: 1100px) {
  .workspace .page-heading { flex-direction: column; align-items: flex-start; gap: 20px; }
}
`;

if (!content.includes('Global Page Heading Redesign')) {
  fs.writeFileSync(path, content + '\n' + globalHeaderCSS, 'utf8');
  console.log('Global Header CSS appended');
}
