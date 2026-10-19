const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetTabsStr = `<div class="tabs">\${b('Company Information','ref-hte-view',id,documents?'secondary small':'small')}\${b('Documents','ref-hte-tab',id,documents?'small':'secondary small')}</div>`;
const newTabsStr = `<div class="tabs" style="margin-bottom: 24px; padding-bottom: 12px;">\${b('Company Information','ref-hte-view',id,documents?'secondary':'')}\${b('Documents','ref-hte-tab',id,documents?'':'secondary')}</div>`;

if (content.includes(targetTabsStr)) {
    content = content.replace(targetTabsStr, newTabsStr);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully updated HTE tab buttons layout!');
} else {
    console.error("Could not find the target tabs string. Let's try Regex.");
    const fallbackRegex = /<div class="tabs">\s*\$\{b\('Company Information','ref-hte-view',id,documents\?'secondary small':'small'\)\}\s*\$\{b\('Documents','ref-hte-tab',id,documents\?'small':'secondary small'\)\}\s*<\/div>/;
    if (content.match(fallbackRegex)) {
        content = content.replace(fallbackRegex, newTabsStr);
        fs.writeFileSync(jsPath, content, 'utf8');
        console.log('Successfully updated HTE tab buttons layout via regex!');
    } else {
        console.error("Regex also failed to find the string.");
    }
}
