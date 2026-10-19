const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/app.js';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(
  "case 'menu':$('#sidebar').classList.toggle('open');document.querySelectorAll('[data-action=\"menu\"]').forEach(b=>b.setAttribute('aria-expanded',$('#sidebar').classList.contains('open')));return;",
  "case 'menu':$('#top-nav-menu').classList.toggle('open');document.querySelectorAll('[data-action=\"menu\"]').forEach(b=>b.setAttribute('aria-expanded',$('#top-nav-menu').classList.contains('open')));return;"
);

c = c.replace(
  "if(event.key==='Escape')$('#sidebar')?.classList.remove('open');",
  "if(event.key==='Escape')$('#top-nav-menu')?.classList.remove('open');"
);

fs.writeFileSync(path, c);
