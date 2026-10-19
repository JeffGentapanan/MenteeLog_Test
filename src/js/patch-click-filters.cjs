const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// The old handler: if(name==='ref-course'){c.view.course=id;c.render();return true;}
// Let's replace it with a smarter toggle handler
const oldHandler = "if(name==='ref-course'){c.view.course=id;c.render();return true;}";
const newHandler = `if(name==='ref-course'){
    const locs = ['Metro Manila','Davao','Cebu'];
    if(id==='All') { c.view.course='All'; c.view.mode='All'; }
    else if(locs.includes(id)) { c.view.mode = c.view.mode===id ? 'All' : id; c.view.course = 'All'; }
    else { c.view.course = c.view.course===id ? 'All' : id; c.view.mode = 'All'; }
    c.render();
    return true;
}`;

if (content.includes(oldHandler)) {
    content = content.replace(oldHandler, newHandler);
}

// Now let's fix the active class condition in the buttons themselves
// Old: c.view.course===s||c.view.mode===s?'ojt-filter active':'ojt-filter'
// Wait, if course is 'All' and mode is 'All', then 'All' is active.
const oldButtons = `\${['All','BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu'].map(s=>b(s,'ref-course',s,c.view.course===s||c.view.mode===s?'ojt-filter active':'ojt-filter')).join('')}`;
const newButtons = `\${['All','BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu'].map(s=>b(s,'ref-course',s, (s==='All' && c.view.course==='All' && c.view.mode==='All') || (s!=='All' && (c.view.course===s || c.view.mode===s)) ? 'ojt-filter active' : 'ojt-filter')).join('')}`;

if (content.includes(oldButtons)) {
    content = content.replace(oldButtons, newButtons);
} else {
    // maybe there's a line break?
    const regexButtons = /\$\{\['All','BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu'\]\.map\(s=>b\(s,'ref-course',s,c\.view\.course===s\|\|c\.view\.mode===s\?'ojt-filter active':'ojt-filter'\)\)\.join\(''\)\}/;
    content = content.replace(regexButtons, newButtons);
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully fixed click logic for filter buttons!');
