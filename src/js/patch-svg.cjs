const fs = require('fs');
const files = [
  'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/assets/logo.svg',
  'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/Team MenteeLog Files/MenteeLog-Logo/MenteeLog-Logo.svg'
];

for(const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/filter="url\(#filter[^"]+\)"/g, 'shape-rendering="geometricPrecision"');
  fs.writeFileSync(file, content);
}
