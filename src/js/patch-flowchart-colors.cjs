const fs = require('fs');
const filepath = 'C:/Users/User/.gemini/antigravity/brain/bdc9d3c0-d8d7-4bcf-b01e-06c72b17d26e/MenteeLog-Flowchart.md';
let content = fs.readFileSync(filepath, 'utf8');

const targetThemeStr = `    primaryColor: '#D85A63'
    primaryTextColor: '#1E293B'
    primaryBorderColor: '#BC3A45'
    lineColor: '#64748B'
    tertiaryColor: '#FDFBF7'
    clusterBkg: '#FAFAF9'
    clusterBorder: '#CBD5E1'`;

const replaceThemeStr = `    primaryColor: '#EFDFBB'
    primaryTextColor: '#1F2937'
    primaryBorderColor: '#58111A'
    lineColor: '#6B7280'
    tertiaryColor: '#FAF4E8'
    clusterBkg: '#FAF4E8'
    clusterBorder: '#EFDFBB'`;

const targetClassStr = `classDef publicAuth fill:#FFF7ED,stroke:#F97316,stroke-width:2px,color:#7C2D12
classDef studentPortal fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F
classDef supervisorPortal fill:#FFF1F2,stroke:#E11D48,stroke-width:2px,color:#881337
classDef coordinatorPortal fill:#FDF2F8,stroke:#DB2777,stroke-width:2px,color:#831843
classDef sharedData fill:#F8FAFC,stroke:#64748B,stroke-width:2px,color:#1E293B
classDef redReport fill:#FFE4E6,stroke:#9F1239,stroke-width:2px,color:#4C0519
classDef decision fill:#FFFFFF,stroke:#D85A63,stroke-width:2px,color:#1E293B`;

const replaceClassStr = `classDef publicAuth fill:#FAF4E8,stroke:#EFDFBB,stroke-width:2px,color:#58111A
classDef studentPortal fill:#FFFFFF,stroke:#EFDFBB,stroke-width:2px,color:#1F2937
classDef supervisorPortal fill:#FFFFFF,stroke:#6B7280,stroke-width:2px,color:#1F2937
classDef coordinatorPortal fill:#FFFFFF,stroke:#58111A,stroke-width:2px,color:#1F2937
classDef sharedData fill:#EFDFBB,stroke:#58111A,stroke-width:2px,color:#58111A
classDef redReport fill:#58111A,stroke:#58111A,stroke-width:2px,color:#FAF4E8
classDef decision fill:#FAF4E8,stroke:#58111A,stroke-width:2px,color:#1F2937`;

if (content.includes(targetThemeStr)) {
    content = content.replace(targetThemeStr, replaceThemeStr);
    content = content.replace(targetClassStr, replaceClassStr);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Successfully updated theme colors in flowchart!');
} else {
    console.error("Could not find the target theme string in flowchart.");
}
