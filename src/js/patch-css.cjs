
const fs = require('fs');
let c = fs.readFileSync('c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css', 'utf8');

c = c.replace('body{margin:0;font-family:Arial,Helvetica,sans-serif;', 'body{margin:0;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;');
c = c.replace('.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:22px;min-width:0}', '.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:22px;min-width:0;box-shadow:var(--shadow)}');

// Find start of .sidebar
const idxStart = c.indexOf('.sidebar{');
const idxEnd = c.indexOf('.breadcrumb{'); // right after .topbar

if (idxStart !== -1 && idxEnd !== -1) {
  const replacement = `.top-nav{height:72px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 30px;gap:15px;background:var(--surface);position:sticky;top:0;z-index:40;box-shadow:var(--shadow)}.top-nav-left{display:flex;align-items:center;gap:16px}.top-nav-center{display:flex;align-items:center;flex:1;justify-content:center}.top-nav-right{display:flex;gap:12px;align-items:center}.nav-links{display:flex;gap:4px;overflow-x:auto}.nav-link{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;transition:background 0.15s, color 0.15s;color:var(--muted)}.nav-link:hover{background:var(--sand);color:var(--burgundy)}.nav-link.active{background:var(--burgundy);color:var(--cream);font-weight:600}.portal-badge{font-size:10px;letter-spacing:1px;font-weight:700}.workspace{margin-left:0;max-width:1640px;margin:auto}.mobile-menu-header{display:none}`;
  c = c.slice(0, idxStart) + replacement + c.slice(idxEnd);
} else {
  console.log('Layout classes not found');
}

// Mobile responsive fixes
// In media(max-width:1150px)
c = c.replace('.sidebar{width:212px;padding:14px 12px}.workspace{margin-left:212px}', '.nav-links{gap:2px}.nav-link{padding:8px 10px}');
c = c.replace('.topbar{padding:0 22px}', '.top-nav{padding:0 22px}');

// In max-width:650px
c = c.replace('.sidebar{transform:translateX(-100%);width:248px;box-shadow:20px 0 60px #34101d33;transition:transform .2s}.sidebar.open{transform:translateX(0)}.workspace{margin-left:0}.mobile-toggle{display:inline-flex}.sidebar .mobile-toggle{position:absolute;right:12px;top:23px;background:none;color:var(--cream);border:0}.content{padding:22px 16px}.topbar{height:66px;padding:0 16px}',
'.top-nav-center{position:fixed;inset:0 0 0 auto;width:260px;background:var(--surface);flex-direction:column;align-items:stretch;justify-content:flex-start;padding:20px;box-shadow:var(--shadow);transform:translateX(100%);transition:transform 0.2s;z-index:100;border-left:1px solid var(--line)}.top-nav-center.open{transform:translateX(0)}.nav-links{flex-direction:column;gap:8px}.mobile-menu-header{display:flex;justify-content:flex-end;margin-bottom:20px}.mobile-toggle{display:inline-flex}.content{padding:22px 16px}.top-nav{height:66px;padding:0 16px;justify-content:space-between}.top-nav-right{gap:8px}');

c = c.replace('.sidebar{visibility:hidden}.sidebar.open{visibility:visible}', '');
c = c.replace('.sidebar,.topbar', '.top-nav');

fs.writeFileSync('c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css', c, 'utf8');
console.log('CSS patched');
