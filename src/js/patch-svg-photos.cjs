const fs = require('fs');
const filepath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/public.js';
let content = fs.readFileSync(filepath, 'utf8');

const regex = /export function photo\(name,cls='',label='MenteeLog students'\)\{.*?\<\/svg>`;\}/;

const newPhotoStr = `export function photo(name,cls='',label='MenteeLog students'){const overrides={group:'img1.jpg',employers:'img2.jpg',skills:'img3.jpg',connections:'img4.jpg',tomorrow:'img5.jpg',supervisor:'img6.jpg',company:'img7.jpg',career:'img8.jpg',portrait:'img9.jpg'};const [file,x,y,w,h]=crops[name]||crops.group;if(overrides[name]){return \`<svg class="reference-photo \${cls}" viewBox="\${x} \${y} \${w} \${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="\${label}"><image href="./assets/team/\${overrides[name]}" x="\${x}" y="\${y}" width="\${w}" height="\${h}" preserveAspectRatio="xMidYMid slice" /></svg>\`;}return \`<svg class="reference-photo \${cls}" viewBox="\${x} \${y} \${w} \${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="\${label}"><image href="./assets/references/\${file}.png" width="\${file==='home'?1359:1400}" height="\${file==='home'?4633:5211}"/></svg>\`;}`;

if (content.match(regex)) {
    content = content.replace(regex, newPhotoStr);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Successfully reverted to exact SVG structure with overridden JPGs!');
} else {
    console.error('Regex failed to match in public.js.');
}
