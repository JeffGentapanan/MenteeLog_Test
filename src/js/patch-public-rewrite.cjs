const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/public.js';
let content = fs.readFileSync(path, 'utf8');

// We will overwrite publicLanding completely.
const newLanding = `export function publicLanding(page,{brand,icon}){
  const selected = page||'home';
  const nav = [['home','Platform Overview'],['auth','Authentication Hub'],['portals','Role Portals'],['data','Data Layers']];
  
  if (selected !== 'home') {
    // Basic fallback for other subpages to route back home
    location.hash = '#/';
  }

  return \`<div class="public-site public-home">
    <header class="reference-header top-nav glass-nav">
      \${brand(false)}
      <nav aria-label="Public navigation">
        \${nav.map(([id,label])=>\`<a href="#/\${id==='home'?'':id}" class="\${selected===id?'selected':''}" \${selected===id?'aria-current="page"':''}>\${label}</a>\`).join('')}
      </nav>
      <a class="btn primary" href="#/login">\${icon('users')} Portal Login</a>
    </header>
    
    <main id="main" tabindex="-1">
      <section class="hero-modern">
        <div class="hero-content text-center">
          <span class="badge neutral mb16" style="display:inline-block">OJT Management Architecture</span>
          <h1 class="text-gradient">MenteeLog System Platform</h1>
          <p class="hero-subtext">A unified, multi-role ecosystem connecting students, supervisors, and coordinators through a shared persistence layer.</p>
          <div class="hero-cta row justify-center mt24">
            <a class="btn primary large" href="#/login">Access Portals</a>
            <a class="btn secondary large" href="#/portals">Explore Architecture</a>
          </div>
        </div>
      </section>

      <section class="architecture-section" id="auth">
        <div class="reference-width">
          <div class="section-heading text-center">
            <span class="kicker">Module 1</span>
            <h2>Public & Authentication Services</h2>
            <p>Secure multi-role gateway for all platform participants.</p>
          </div>
          <div class="grid-3 mt24">
            <div class="card premium-card">
              <div class="card-icon">\${icon('shield')}</div>
              <h3>Role Auth Check</h3>
              <p>Strict credential validation for Student (SR Code), Supervisor (Corporate Email), and Coordinator (Faculty ID) roles.</p>
            </div>
            <div class="card premium-card">
              <div class="card-icon">\${icon('mail')}</div>
              <h3>Account Activation</h3>
              <p>Secure token verification workflows and password reset modal interfaces.</p>
            </div>
            <div class="card premium-card">
              <div class="card-icon">\${icon('bell')}</div>
              <h3>Notification Center</h3>
              <p>Centralized bell icon overlay with tabs for All, Unread, and System alerts.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="architecture-section bg-sand" id="portals">
        <div class="reference-width">
          <div class="section-heading text-center">
            <span class="kicker">Modules 2, 3, 4</span>
            <h2>Dedicated Role Portals</h2>
            <p>Tailored interfaces ensuring compliance, progress tracking, and governance.</p>
          </div>
          <div class="portal-grid mt24">
            <div class="card premium-card student-theme">
              <h3>🎓 Student Portal</h3>
              <ul class="feature-list mt16">
                <li><strong>2.0</strong> Student Dashboard</li>
                <li><strong>2.1</strong> Profile Setup</li>
                <li><strong>2.2</strong> Job Browse & Apply</li>
                <li><strong>2.3</strong> Application Status</li>
                <li><strong>2.4</strong> DTR Submissions & Reports</li>
                <li><strong>2.5</strong> Incident Module (Form + Evidence)</li>
                <li><strong>2.6</strong> Performance Appraisal Result</li>
              </ul>
            </div>
            <div class="card premium-card supervisor-theme">
              <h3>🏢 Supervisor Portal</h3>
              <ul class="feature-list mt16">
                <li><strong>3.0</strong> Supervisor Dashboard</li>
                <li><strong>3.1</strong> Candidate Review</li>
                <li><strong>3.2</strong> Application Review</li>
                <li><strong>3.3</strong> Student Progress Tracking</li>
                <li><strong>3.4</strong> Disciplinary Module (Link DTR)</li>
                <li><strong>3.5</strong> Performance Appraisal Module</li>
              </ul>
            </div>
            <div class="card premium-card coordinator-theme">
              <h3>🏫 Coordinator Portal</h3>
              <ul class="feature-list mt16">
                <li><strong>4.0</strong> Coordinator Dashboard</li>
                <li><strong>4.1</strong> Job Management</li>
                <li><strong>4.2</strong> Candidate Tracking</li>
                <li><strong>4.3</strong> Reports & Analytics</li>
                <li><strong>4.4</strong> Incident & Compliance Hub</li>
                <li><strong>4.5</strong> User Governance (Pre-seed, RBAC)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="architecture-section" id="data">
        <div class="reference-width">
          <div class="section-heading text-center">
            <span class="kicker">Module 5</span>
            <h2>Shared Persistence Layer</h2>
            <p>The centralized databases powering real-time state across all modules.</p>
          </div>
          <div class="grid-4 mt24">
            <div class="stat modern-stat">
              <div class="stat-icon">\${icon('users')}</div>
              <div><strong>User Store</strong><p>Users & Accounts</p></div>
            </div>
            <div class="stat modern-stat">
              <div class="stat-icon">\${icon('briefcase')}</div>
              <div><strong>Job Store</strong><p>Listings & HTE Specs</p></div>
            </div>
            <div class="stat modern-stat">
              <div class="stat-icon">\${icon('file')}</div>
              <div><strong>App Store</strong><p>Apps & Appraisals</p></div>
            </div>
            <div class="stat modern-stat">
              <div class="stat-icon">\${icon('alert')}</div>
              <div><strong>Report Store</strong><p>Violations & Claims</p></div>
            </div>
          </div>
        </div>
      </section>

      <footer class="reference-footer text-center mt32">
        <h2>MenteeLog Architecture</h2>
        <p>Built according to the structured OJT Management Flowchart.</p>
        <div class="mt24">
          <a class="btn primary" href="#/login">Enter Platform</a>
        </div>
      </footer>
    </main>
  </div>\`;
}`;

const authScreenReplacement = `export function authScreen(mode,role,{brand,icon,field}){
  const activate=mode==='activate',reset=mode==='reset';
  return \`<div class="auth-modern">
    <div class="auth-card premium-card">
      <header class="text-center mb24">
        \${brand()}
        <h2 class="mt16">\${activate?'Account Activation':reset?'Password Reset':'Authentication Hub'}</h2>
        <p class="muted">\${activate?'Activate your provisioned account':reset?'Set your new password':'Secure Multi-Role Gateway'}</p>
      </header>
      
      <div class="auth-body">
        \${activate?\`
          <p class="auth-label text-center">SELECT ROLE</p>
          <div class="row gap-12 mt16 mb24">
            \${['Student','Supervisor'].map(r=>\`<button type="button" class="btn flex-1 \${role===r?'primary':'secondary'}" data-action="auth-role" data-id="\${r}">\${icon(r==='Student'?'users':'building')} \${r}</button>\`).join('')}
          </div>
          <form id="activation-form">
            \${field(role==='Supervisor'?'CORPORATE EMAIL':'SR CODE','identifier',role==='Supervisor'?'email':'text','','required')}
            \${field('REGISTERED EMAIL','email','email','','required')}
            <p class="form-error" role="alert"></p>
            <button type="submit" class="btn primary full mt16">Verify Token</button>
          </form>
          <a class="auth-link text-center block mt16" href="#/login">+? Return to Login</a>
        \`:reset?\`
          <form id="reset-form">
            \${field('VERIFICATION TOKEN','token','text','','required minlength="6"')}
            \${field('NEW PASSWORD','password','password','','required minlength="12"')}
            \${field('CONFIRM PASSWORD','confirm','password','','required minlength="12"')}
            <p class="form-error" role="alert"></p>
            <button type="submit" class="btn primary full mt16">Set Password</button>
          </form>
          <a class="auth-link text-center block mt16" href="#/login">+? Return to Login</a>
        \`:\`
          <div class="auth-tabs row mb24">
            \${['Student','Supervisor','Coordinator'].map(r=>\`<button class="btn flex-1 \${r===role?'primary':'secondary'}" data-action="auth-role" data-id="\${r}" aria-pressed="\${r===role}">\${icon(r==='Student'?'users':r==='Supervisor'?'building':'users')} \${r}</button>\`).join('')}
          </div>
          <form id="login-form">
            \${field(role==='Student'?'SR CODE':role==='Supervisor'?'CORPORATE EMAIL':'FACULTY ID','identifier',role==='Supervisor'?'email':'text','','required autocomplete="username"')}
            <div class="field mb16">
              <label for="password">PASSWORD</label>
              <div class="password-field">
                <input id="password" name="password" type="password" required autocomplete="current-password">
                <button type="button" data-action="toggle-password" aria-label="Show password" style="background:transparent;border:none;position:absolute;right:10px;top:10px;cursor:pointer;">\${icon('eye')}</button>
              </div>
            </div>
            <button type="button" class="auth-link block mb24 text-right" style="background:none;border:none;cursor:pointer;" data-action="forgot">Forgot Password?</button>
            <p class="form-error" role="alert"></p>
            <button class="btn primary full" type="submit" style="height:48px;font-size:16px;">Access \${role} Portal</button>
          </form>
          <p class="text-center mt24 muted">First time here? <a class="auth-link" href="#/activate">Activate Account</a></p>
          <a class="auth-link text-center block mt16" href="#/">+? Platform Overview</a>
        \`}
      </div>
    </div>
  </div>\`;
}`;

// Replace functions in public.js
let newContent = content.replace(/export function publicLanding.*?export function authScreen/s, newLanding + '\n' + authScreenReplacement.split('export function authScreen')[0] + 'export function authScreen');
newContent = newContent.replace(/export function authScreen.*/s, authScreenReplacement);

fs.writeFileSync(path, newContent, 'utf8');
console.log('public.js redesigned from scratch');
