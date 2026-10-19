const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/app.js';
let content = fs.readFileSync(path, 'utf8');

// The original line looks like:
// </section>${notificationsMini(u)}</div>
// And it's inside <div class="overview-grid">

// 1. We replace `<div class="overview-grid">` with something that doesn't split it 2-ways if we remove notifications, 
// or we just let it be a normal block since the Notifications card is gone.
// Let's replace `<div class="overview-grid">` with `<div class="overview-single">` or just remove the grid wrapper.
content = content.replace('<div class="overview-grid"><section class="card">', '<div class="overview-single"><section class="card">');

// 2. We remove `${notificationsMini(u)}` entirely.
// Both for Student and Coordinator dashboards if present.
content = content.replace('</section>${notificationsMini(u)}</div>', '</section></div>');

// Remove from coordinator as well if present
content = content.replace('</div>${notificationsMini(u)}', '</div>');

fs.writeFileSync(path, content, 'utf8');
console.log('Removed notificationsMini from app.js dashboard');
