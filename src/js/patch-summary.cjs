const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /<summary style="font-weight: 600; font-size: 13px; color: var\(--ink\); cursor: pointer; outline: none;">Technical Details<\/summary>/;

const newSummary = `
<style>
  .dtr-tech-summary { font-weight: 600; font-size: 15px !important; color: var(--ink); cursor: pointer; outline: none; text-decoration: underline; text-underline-offset: 4px; padding-left: 4px; }
  .dtr-tech-summary::marker { font-size: 18px; }
  .dtr-tech-summary::-webkit-details-marker { font-size: 18px; }
</style>
<summary class="dtr-tech-summary">Technical Details</summary>`;

if (content.match(regex)) {
  content = content.replace(regex, newSummary);
  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('Summary replaced successfully.');
} else {
  console.log('Regex did not match.');
}
