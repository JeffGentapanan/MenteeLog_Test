const fs = require('fs');
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(cssPath, 'utf8');

// Remove the previous block if it exists so we can replace it cleanly
if (content.includes('/* Forced spacing for DTR filters */')) {
    content = content.split('/* Forced spacing for DTR filters */')[0];
}

const cssToInject = `
/* Forced spacing for DTR filters */
.reference-dtr .tabs,
.reference-dtr [style*="display: grid"] {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 16px !important;
    margin-bottom: 32px !important;
}

/* Base style for the buttons */
.reference-dtr .tabs .tab,
.reference-dtr .tabs button,
.reference-dtr button[data-action="filter"] {
    border-radius: 12px !important;
    border: 1px solid var(--line) !important;
    padding: 12px 20px !important;
    margin: 0 !important;
    background: var(--surface) !important;
    color: var(--ink) !important;
    font-weight: 600 !important;
    transition: all 0.2s ease !important;
    cursor: pointer !important;
}

/* Hover state */
.reference-dtr .tabs .tab:hover,
.reference-dtr .tabs button:hover,
.reference-dtr button[data-action="filter"]:hover {
    background: #e2d3ce !important; /* A slightly darker sand/line color for hover */
    color: var(--ink) !important;
    border-color: #c9b1ab !important;
}

/* Active (Clicked) state */
.reference-dtr .tabs .active,
.reference-dtr .tabs .tab[aria-pressed="true"],
.reference-dtr button[data-action="filter"].active,
.reference-dtr button[data-action="filter"][aria-pressed="true"],
.reference-dtr button[data-action="filter"][style*="var(--primary)"] {
    background: var(--primary) !important;
    color: var(--cream) !important;
    border-color: var(--primary) !important;
    box-shadow: 0 4px 12px rgba(88, 17, 26, 0.25) !important;
}
`;

content += cssToInject;
fs.writeFileSync(cssPath, content, 'utf8');
console.log('Advanced interactive CSS injected successfully!');
