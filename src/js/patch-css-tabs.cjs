const fs = require('fs');
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(cssPath, 'utf8');

const cssToInject = `
/* Forced spacing for DTR filters */
.reference-dtr .tabs,
.reference-dtr [style*="display: grid"] {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 16px !important;
    margin-bottom: 32px !important;
}
.reference-dtr .tabs .tab,
.reference-dtr .tabs button,
.reference-dtr button[data-action="filter"] {
    border-radius: 12px !important;
    border: 1px solid var(--line) !important;
    padding: 12px 20px !important;
    margin: 0 !important;
}
`;

if (!content.includes('/* Forced spacing for DTR filters */')) {
    content += '\n' + cssToInject;
    fs.writeFileSync(cssPath, content, 'utf8');
    console.log('CSS injected successfully!');
} else {
    console.log('CSS already exists.');
}
