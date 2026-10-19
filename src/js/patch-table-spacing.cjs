const fs = require('fs');
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(cssPath, 'utf8');

const targetStr = `.workspace .table-wrap {\n    border: 1px solid rgba(0,0,0,0.06);\n    border-radius: 12px;\n    overflow: hidden;`;
const replaceStr = `.workspace .table-wrap {\n    margin-bottom: 24px;\n    border: 1px solid rgba(0,0,0,0.06);\n    border-radius: 12px;\n    overflow: hidden;`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(cssPath, content, 'utf8');
    console.log('Successfully added margin to table-wrap!');
} else {
    console.error("Could not find the target string.");
    // Fallback: just append
    fs.appendFileSync(cssPath, "\n\n/* Added by AI to fix table bottom margin */\n.workspace .table-wrap { margin-bottom: 24px !important; }\n");
    console.log('Appended margin fallback.');
}
