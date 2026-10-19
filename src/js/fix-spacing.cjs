const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Replace the dynamic margin with a solid 32px or 40px margin to give it breathing room
const oldString = '`<div class="row wrap gap-8 ${c.view.more?\'mb16\':\'mb32\'}">';
// I will actually add a custom inline style for a guaranteed 32px gap, since styles are allowed now!
// Or just use mb32. Wait, earlier I added .mb32 to styles.css.
const newString = '`<div class="row wrap gap-8 mb32" style="margin-bottom: 32px;">';

if (jsContent.includes(oldString)) {
  jsContent = jsContent.replace(oldString, newString);
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log('Fixed margin');
} else {
  console.log('String not found, checking current state...');
  console.log(jsContent.substring(jsContent.indexOf('const list='), jsContent.indexOf('const list=') + 1000));
}
