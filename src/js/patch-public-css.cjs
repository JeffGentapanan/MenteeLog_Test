const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(path, 'utf8');

const landingCSS = `
/* =========================================
   PUBLIC / AUTHENTICATION MODERN REDESIGN
   ========================================= */
.glass-nav {
  position: sticky; top: 0; z-index: 50;
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 5%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.glass-nav nav { display: flex; gap: 24px; }
.glass-nav nav a {
  font-weight: 600; color: var(--muted);
  text-decoration: none; transition: color 0.2s;
}
.glass-nav nav a:hover, .glass-nav nav a.selected { color: var(--burgundy); }

.hero-modern {
  min-height: 80vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--cream) 0%, #fff 100%);
  padding: 60px 5%;
}
.hero-content { max-width: 800px; margin: 0 auto; }
.text-gradient {
  font-size: 56px; font-weight: 800; line-height: 1.1;
  letter-spacing: -2px; margin-bottom: 24px;
  background: linear-gradient(to right, var(--burgundy), #BC3A45);
  -webkit-background-clip: text; color: transparent;
}
.hero-subtext { font-size: 20px; color: var(--muted); line-height: 1.6; }

.architecture-section { padding: 100px 5%; }
.bg-sand { background: var(--sand-light); }
.section-heading .kicker {
  display: inline-block; padding: 4px 12px; background: var(--sand);
  color: var(--burgundy); border-radius: 999px; font-weight: 700;
  font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;
}
.section-heading h2 { font-size: 36px; font-weight: 800; margin: 0 0 16px; letter-spacing: -1px; }
.section-heading p { font-size: 18px; color: var(--muted); }

.portal-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
}
.feature-list { list-style: none; padding: 0; margin: 0; }
.feature-list li {
  padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05);
  color: var(--muted); font-size: 14px;
}
.feature-list li strong { color: var(--ink); margin-right: 8px; }

.auth-modern {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--cream) 0%, #fff 100%);
  padding: 24px;
}
.auth-card {
  width: 100%; max-width: 480px;
  background: #fff; padding: 48px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}
.auth-link { color: var(--burgundy); font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }

.text-center { text-align: center; }
.justify-center { justify-content: center; }
.gap-12 { gap: 12px; }
.mt32 { margin-top: 32px; }
.block { display: block; }
.password-field { position: relative; }

/* Responsive Adjustments */
@media (max-width: 900px) {
  .text-gradient { font-size: 40px; }
  .portal-grid { grid-template-columns: 1fr; }
  .glass-nav nav { display: none; } /* Simplified mobile nav */
}
@media (max-width: 600px) {
  .auth-card { padding: 32px 24px; }
  .hero-modern { min-height: 60vh; padding-top: 40px; }
  .architecture-section { padding: 60px 5%; }
  .hero-actions { flex-direction: column; width: 100%; }
}
`;

if (!content.includes('PUBLIC / AUTHENTICATION MODERN REDESIGN')) {
  fs.writeFileSync(path, content + '\n' + landingCSS, 'utf8');
  console.log('Public CSS appended');
}
