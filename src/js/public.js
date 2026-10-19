// Rebuild of the supplied landing/authentication exports. Only photograph
// regions are reused from PNGs; text, navigation, cards and buttons are HTML.
const crops={group:['home',178,2398,500,268],employers:['home',711,2398,497,268],skills:['home',169,1548,318,177],connections:['home',520,1548,319,177],tomorrow:['home',869,1548,318,177],supervisor:['company',97,997,509,287],company:['company',791,997,510,287],career:['company',467,1529,509,286],portrait:['company',246,2427,279,267]};
export function photo(name,cls='',label='MenteeLog students'){const overrides={group:'img1.jpg',employers:'img2.jpg',skills:'img3.jpg',connections:'img4.jpg',tomorrow:'img5.jpg',supervisor:'img6.jpg',company:'img7.jpg',career:'img8.jpg',portrait:'img9.jpg'};const [file,x,y,w,h]=crops[name]||crops.group;if(overrides[name]){return `<svg class="reference-photo ${cls}" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><image href="./assets/team/${overrides[name]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" /></svg>`;}return `<svg class="reference-photo ${cls}" viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><image href="./assets/references/${file}.png" width="${file==='home'?1359:1400}" height="${file==='home'?4633:5211}"/></svg>`;}
const partners=['Accenture PH','Globe Telecom','BDO Unibank','MORE Power','SM Technologies','PLDT','Metrobank','PhilStar Digital'];
function partnerSection(dark=false){return `<section id="partnerships" class="partner-section ${dark?'maroon':''}"><h3>ACCREDITED HOST TRAINING ESTABLISHMENTS</h3><div class="partner-list">${partners.map(p=>`<span>${p}</span>`).join('')}</div></section>`;}
function joinSection(safe=true){return `<section class="join-section">${safe?'<p class="public-kicker">&mdash; Safe. Verified. Reliable. &mdash;</p><h2 class="reveal-on-scroll">Strong Local Partnerships, Nationwide.</h2><p class="public-small">Trusted companies. Real opportunities.</p>':''}<p class="public-kicker">&mdash; Join MenteeLog &mdash;</p><h2 class="reveal-on-scroll">Where Talent Connects with Opportunity.</h2><p class="public-small">Empowering careers and simplifying hiring: Menteelog makes connecting with skilled Filipino interns effortless.</p><a class="btn" href="#/login">Get Started</a></section>`;}

function contactSection(icon) {
    return `<section id="contact" class="contact-section reveal-on-scroll">
        <div class="contact-container">
            <div class="contact-photo-stage">
                <!-- Warm Breathing Glow Halo -->
                <div class="contact-orbit-glow" aria-hidden="true"></div>

                <!-- Dual Rotating SVG Orbital Rings -->
                <svg class="contact-orbit-svg orbit-outer" viewBox="0 0 500 500" aria-hidden="true">
                    <circle cx="250" cy="250" r="235" fill="none" class="orbit-path-outer" />
                    <circle cx="250" cy="15" r="5" class="orbit-node-coral" />
                    <circle cx="485" cy="250" r="4" class="orbit-node-burgundy" />
                </svg>
                <svg class="contact-orbit-svg orbit-inner" viewBox="0 0 500 500" aria-hidden="true">
                    <circle cx="250" cy="250" r="215" fill="none" class="orbit-path-inner" />
                    <circle cx="250" cy="465" r="4.5" class="orbit-node-coral" />
                    <circle cx="35" cy="250" r="3.5" class="orbit-node-sand" />
                </svg>

                <!-- Floating Badges -->
                <div class="contact-floating-badge badge-top-right" aria-hidden="true">
                    <span class="badge-dot-live"></span>
                    <strong>Verified</strong> OJT Cohort
                </div>
                <div class="contact-floating-badge badge-bottom-left" aria-hidden="true">
                    <span class="badge-icon-acad"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:-2px;"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/></svg></span>
                    <span>MenteeLog Partner</span>
                </div>

                <!-- Circular Photo Wrapper -->
                <div class="contact-photo-wrapper">
                    ${photo('portrait', 'contact-img')}
                </div>
            </div>

            <div class="contact-form-card">
                <div class="contact-card-top-decor" aria-hidden="true">
                    <span class="decor-line"></span>
                    <div class="decor-motif">
                        <span class="decor-dot dot-burgundy"></span>
                        <span class="decor-dot dot-coral"></span>
                        <span class="decor-dot dot-sand"></span>
                    </div>
                    <span class="decor-line"></span>
                </div>
                <h3 class="contact-title">Connect with our team to explore partnership or request a demo.</h3>
                <p class="contact-subtitle">Let's Work Together</p>
                
                <form id="public-contact-form" class="contact-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Name <span>*</span></label>
                            <input type="text" name="name" placeholder="Your full name" required>
                        </div>
                        <div class="form-group">
                            <label>Email <span>*</span></label>
                            <input type="email" name="email" placeholder="your@email.com" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Company / Organization</label>
                            <input type="text" name="company" placeholder="Your company (optional)">
                        </div>
                        <div class="form-group">
                            <label>I am a</label>
                            <select name="role" required>
                                <option value="Employer">Employer</option>
                                <option value="University">University</option>
                                <option value="Student">Student</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Message <span>*</span></label>
                        <textarea name="message" placeholder="Tell us about your inquiry or how we can help..." rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn full contact-submit">Send Message</button>
                    <div class="contact-card-bottom-decor" aria-hidden="true">
                        <span class="decor-bottom-line"></span>
                        <div class="decor-bottom-motif">
                            <span class="decor-dot dot-coral"></span>
                            <span class="decor-dot dot-burgundy"></span>
                            <span class="decor-dot dot-coral"></span>
                        </div>
                        <span class="decor-bottom-line"></span>
                    </div>
                </form>
            </div>
        </div>
    </section>`;
}

function footer(){
  return `<footer class="reference-footer" style="background-color: var(--burgundy); color: white; padding: 60px 5%; display: flex; flex-direction: column; align-items: center; position: relative; overflow: hidden; min-height: unset;">
  
  <div style="display: flex; flex-wrap: wrap; gap: 48px; width: 100%; justify-content: space-between; margin-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 48px;">
    
    <!-- Logo & Contact -->
    <div class="footer-contact" style="text-align: left; flex: 1; min-width: 200px;">
      <a href="#/" aria-label="MenteeLog home" style="display: block; margin-bottom: 20px;">
        <img class="footer-logo" src="./assets/MenteeLog_Logo.svg" alt="MenteeLog" style="height: 45px; object-fit: contain; margin-left: -4px;">
      </a>
      <p style="margin: 10px 0; display: flex; align-items: center; gap: 12px; font-size: 14px; color: #f2e3df;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 15px; height: 15px; flex-shrink:0;"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        info@menteelog.com
      </p>
      <p style="margin: 10px 0; display: flex; align-items: center; gap: 12px; font-size: 14px; color: #f2e3df;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 15px; height: 15px; flex-shrink:0;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        Iloilo, Philippines
      </p>
    </div>

    <!-- Nav Column: Students -->
    <div style="flex: 1; min-width: 130px;">
      <p style="font-weight: 700; font-size: 13px; letter-spacing: 0.08em; color: #f2e3df; margin-bottom: 16px; text-transform: uppercase;">Students</p>
      <a href="#/" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Home</a>
      <a href="#/public/students" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Student Portal</a>
      <a href="#/public/guide" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">OJT Success Guide</a>
      <a href="#/login" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Sign In</a>
    </div>

    <!-- Nav Column: Employers -->
    <div style="flex: 1; min-width: 130px;">
      <p style="font-weight: 700; font-size: 13px; letter-spacing: 0.08em; color: #f2e3df; margin-bottom: 16px; text-transform: uppercase;">Employers</p>
      <a href="#/public/supervisor" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Supervisor Portal</a>
      <a href="#/public/company" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">About MenteeLog</a>
      <a href="#/public/students" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Browse Interns</a>
      <a href="#/public/supervisor" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Request Demo</a>
    </div>

    <!-- Nav Column: Institutions -->
    <div style="flex: 1; min-width: 130px;">
      <p style="font-weight: 700; font-size: 13px; letter-spacing: 0.08em; color: #f2e3df; margin-bottom: 16px; text-transform: uppercase;">Institutions</p>
      <a href="#/public/career-centers" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Career Centers</a>
      <a href="#/public/career-centers" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Partnerships</a>
      <a href="#/public/guide" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Compliance Guide</a>
      <a href="#/public/career-centers" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Request Demo</a>
    </div>

    <!-- Nav Column: Company -->
    <div style="flex: 1; min-width: 130px;">
      <p style="font-weight: 700; font-size: 13px; letter-spacing: 0.08em; color: #f2e3df; margin-bottom: 16px; text-transform: uppercase;">Company</p>
      <a href="#/public/company" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">About Us</a>
      <a href="#/public/company" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Our Team</a>
      <a href="#/public/students" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Press</a>
      <a href="#/public/company" style="display: block; color: #d6babb; font-size: 14px; margin-bottom: 10px; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#d6babb'">Contact</a>
    </div>

  </div>

  <h2 style="font-size: clamp(28px, 4vw, 42px); line-height: 1.4; font-weight: 700; margin: 0 auto 48px; text-align: center; color: white;">
    Inspiring Excellence.<br>
    Linking Opportunities.<br>
    Transforming the Future.
  </h2>
  
  <div class="footer-legal" style="font-size: 13px; color: #d6babb; text-align: center; width: 100%;">
    <p style="margin-bottom: 12px;">&copy; Copyright 2025 OJT Connect. All Rights Reserved.</p>
    <button class="footer-policy" data-action="privacy" style="background: none; border: none; color: inherit; cursor: pointer; margin-bottom: 30px; font-weight: 500;">Privacy and Cookies Policy</button>
    
    <div class="social-symbols" aria-label="Social media icons" style="display: flex; justify-content: center; gap: 20px;">
      <a href="#/" aria-label="LinkedIn" style="color: white; transition: opacity 0.2s;"><svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
      <a href="#/" aria-label="Facebook" style="color: white; transition: opacity 0.2s;"><svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>
      <a href="#/" aria-label="Instagram" style="color: white; transition: opacity 0.2s;"><svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
      <a href="#/" aria-label="TikTok" style="color: white; transition: opacity 0.2s;"><svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.61.94-5.3 3.02-6.78 1.65-1.18 3.8-1.61 5.75-1.2l.02 4.13c-1.02-.13-2.09-.07-3.05.34-1.5.6-2.58 2.03-2.65 3.63-.07 1.37.66 2.69 1.83 3.33 1.25.68 2.87.69 4.14-.04 1.47-.85 2.45-2.43 2.46-4.13.03-5.26.02-10.51.02-15.77z"/></svg></a>
      <a href="#/" aria-label="YouTube" style="color: white; transition: opacity 0.2s;"><svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
    </div>
  </div>
</footer>`;}
const homeJobs=[['A','Technology Analyst Intern','Accenture Philippines','BSIT','Mandurriao, Iloilo City',12],['G','Network Systems Intern','Globe Telecom','BSIT','City Proper, Iloilo City',8],['B','FinTech & Systems Intern','BDO Unibank','BSIT','Jaro, Iloilo City',6],['M','ICT Infrastructure Intern','MORE Power','BSIT','La Paz, Iloilo City',4],['P','Web & Software Intern','PhilStar Digital','BSIT','Molo, Iloilo City',5],['S','Database & BI Intern','SM Technologies','BSIT','Mandurriao, Iloilo City',10]];
export function publicLanding(page,{brand,icon}){const selected=['students','supervisor','career-centers','company','guide'].includes(page)?page:'home';const nav=[['home','Home'],['students','Students'],['supervisor','Supervisor'],['career-centers','Career Centers'],['company','Company']];const heroes={home:['One Platform.<br>Every OJT Journey.','Seamlessly connect students, industry supervisors, and OJT<br>coordinators. From placement to completion - fully digital, fully<br>tracked.','Get Started - Its Free','group','Student'],students:['BE NOTICED. GET PLACED.','Connect with accredited local and international internship opportunities.','Begin Your OJT Journey','connections','Student'],supervisor:['PARTNER SMARTER.<br>MANAGE INTERNS EFFORTLESSLY.','Connect with verified student interns,<br>streamline MOA accreditations, and evaluate performance in one place.','Become a Partner HTE','supervisor','Supervisor'],'career-centers':["STREAMLINE OJT GOVERNANCE & COMPLIANCE",'Manage student placements, track real-time hours, and monitor MOA accreditations in one platform.','Access Coordinator Portal','career','Coordinator'],company:['MENTEELOG','Manage student placements, track real-time hours, and monitor MOA accreditations in one platform','Get Started','company','Student'], guide:['THE COMPLETE OJT GUIDE','Master every module of the MenteeLog ecosystem from onboarding to graduation.','Enter MenteeLog','group','Student']};const [title,subtitle,cta,img,role]=heroes[selected];return `<div class="public-site public-${selected}"><div class="public-constellation-layer" aria-hidden="true"><canvas id="public-constellation-canvas" class="public-constellation-canvas"></canvas></div><header class="reference-header">${brand()}<nav aria-label="Public navigation">${nav.map(([id,label])=>`<a href="#/${id==='home'?'':'public/'+id}" class="${selected===id?'selected':''}" onclick="document.body.classList.remove('menu-open')" ${selected===id?'aria-current="page"':''}>${label}</a>`).join('')}</nav><div class="header-actions">    <a class="btn secondary header-activate" href="#/activate">Activate</a>    <a class="btn" href="#/login">Sign In</a>    <button class="mobile-menu-btn" onclick="document.body.classList.toggle('menu-open')" aria-label="Toggle navigation">        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>    </button></div></header><main id="main" tabindex="-1"><section class="reference-hero">${photo(img,'hero-photo')}<div class="hero-overlay"></div><div class="reference-hero-content"><span class="hero-pill">${icon('shield')} Real-time OJT Placement & Tracking</span><h1>${title}</h1><p>${subtitle}</p><div class="hero-cta"><a class="btn" data-role="${role}" href="#/login">${cta}</a>${selected==='home'?'<button class="btn watch-button" data-action="watch-demo">Watch Demo</button>':''}</div></div></section>${selected==='home'?homeBody(icon):selected==='company'?companyBody(icon):selected==='guide'?guideBody(icon):roleBody(selected,icon)}${selected==='home'?partnerSection()+joinSection()+faqSection():selected==='company'?joinSection(false):partnerSection(selected!=='students')+joinSection()}${['students', 'supervisor', 'career-centers', 'company'].includes(selected) ? contactSection(icon) : ''}</main>${footer()}</div>`;}
function homeBody(icon){return `<section class="opportunities reference-width"><div class="row between"><div><h2 class="reveal-on-scroll">Open OJT Opportunities</h2><p>Currently accepting applications for AY 2025-2026</p></div><div class="public-filters"><select id="public-course" aria-label="Filter opportunities by course"><option value="All">All Programs (BSIT)</option><option value="BSIT">BS Information Technology (BSIT)</option></select><select id="public-location" aria-label="Filter opportunities by location"><option value="All">All Locations</option>${['Mandurriao','City Proper','Jaro','La Paz','Molo'].map(v=>`<option>${v}</option>`).join('')}</select></div></div><div class="home-jobs">${homeJobs.map(([initial,title,company,courses,location,slots])=>`<article class="home-job reveal-on-scroll" data-courses="${courses}" data-location="${location}"><div class="row"><span class="home-job-logo">${initial}</span><div><h3>${title}</h3><p>${company}</p></div></div><ul><li>${icon('users')} ${courses}</li><li>${icon('pin')} ${location}</li><li>${icon('users')} ${slots} slots available</li></ul><a class="btn" href="#/login">Apply Now</a></article>`).join('')}</div><p id="public-empty" class="small" hidden>No opportunities match these filters.</p></section><section class="why-section reference-width"><p class="section-kicker reveal-on-scroll">&mdash; Why MenteeLog is the Right Choice &mdash;</p><h2 class="reveal-on-scroll">Aligning skills with opportunities:<br>connecting driven interns and trusted employers.</h2><p class="public-small">Simplifying local internships through trusted listings and authentic paths to employment.</p><div class="public-stats">${[['1,240+','Registered Students'],['86','Accredited HTEs'],['98%','Placement Rate'],['500K+','DTR Hours Logged']].map(([n,l])=>`<div><strong>${n}</strong><span>${l}</span></div>`).join('')}</div><div class="benefit-grid">${[['skills','Unlocking Capabilities','&mdash; Grow Your Skills &mdash;','Build confidence, gain experience, and step directly into your field. Menteelog gives you guided app features and verified internships to fast-track your career growth.'],['connections','Connecting Opportunities','&mdash; Step Into Your Career &mdash;','Discover relevant roles, apply fast, and step directly into your field. Menteelog aligns your skills with real-world opportunities across the Philippines and beyond.'],['tomorrow','Building a Stronger Tomorrow','&mdash; Define Your Career Path &mdash;','Build your future on a solid foundation. Menteelog brings interns and companies together through trusted opportunities designed for real career advancement.']].map(([p,t,k,d])=>`<article class="benefit-card reveal-on-scroll">${photo(p)}<div><h3>${t}</h3><p class="card-kicker">${k}</p><p>${d}</p><a class="btn" href="#/public/students">Learn more</a></div></article>`).join('')}</div></section><section class="how-section"><p class="section-kicker reveal-on-scroll">&mdash; How MenteeLog Works &mdash;</p><h2 class="reveal-on-scroll">Simplifying Internship Hiring for Students and Verified Companies</h2><p class="public-small">Post opportunities, submit applications, and connect directly-Menteelog streamlines your entire internship workflow.</p><div class="how-grid reference-width">${[['group','For Interns','&mdash; Your Path to the Right Internship &mdash;','Find opportunities and automate your training logs.',['Explore verified job listings from accredited companies','Search by role, skills, location, setup, and date posted','Apply to multiple listings with resume attachments','Automated 100m GPS geofenced clock in and clock out','Track rendered hours with live pause/resume break tracking','Receive 7-criteria digital performance appraisals with supervisor signatures'],'students'],['employers','For Employers','&mdash; A Simpler Way to Manage Interns &mdash;','Connect with skilled interns and monitor progress effortlessly.',['Post clear and detailed OJT training slots','Access a verified pool of student applicants','Screen candidates and manage application pipelines','Eliminate manual clock-in friction with automated 100m geofencing','Review flagged attendance exceptions and map justifications','Conduct 7-criteria performance evaluations with draw digital signatures'],'supervisor']].map(([p,t,k,d,items,to])=>`<article class="how-card reveal-on-scroll">${photo(p)}<div><h3>${t}</h3><p class="card-kicker">${k}</p><p>${d}</p><ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul><a class="btn" href="#/public/${to}">Learn more</a></div></article>`).join('')}</div></section>`;}
function roleBody(page,icon){let title,kicker,sub,items;if(page==='students'){title='YOUR SEAMLESS PATH TO PLACEMENT';kicker='&mdash; How MenteeLog Works &mdash;';sub='Discover accredited opportunities, log your hours, track performance, and fulfill your OJT requirements-all in one platform.';items=[['pin','Discover','Accredited listings from partner HTEs'],['search','Apply','With one-click resume attachments'],['file','Track','Application status and clearance requirements'],['chart','Filter','By BSIT program, required skills, and location'],['clock','100m Geofenced DTR','Automated GPS geofence verification, live map & task summaries'],['briefcase','Complete Hours','Auto-verified on-site hours, justifications & live progress']];}else if(page==='supervisor'){title='A STREAMLINED PATHWAY FOR INDUSTRY PARTNERS';kicker='&mdash; Host Training Establishment (HTE) Ecosystem &mdash;';sub='Onboard student interns, satisfy institutional compliance, and review performance seamlessly.';items=[['plus','Post Placements','Publish verified OJT roles tied to degree tracks'],['users','Review Applicants','Screen verified student profiles and resumes in a unified pipeline'],['briefcase','Track Candidates','Manage candidate pipelines, interviews, and offers'],['clock','Attendance Overview','Automated on-site hours tracking & flagged shift exception review'],['chart','Manage MOAs','Track company accreditations, active slots, and renewals'],['star','Evaluate Interns','7-criteria performance appraisals with authentic drawn canvas signatures']];}else{title="ELEVATE YOUR INSTITUTION'S OJT MANAGEMENT";kicker='';sub='';items=[['users','Manage HTEs','Accredit partner companies and monitor active MOA status'],['briefcase','Place Students','Match interns with accredited host companies and assign supervisors'],['target','Resolve Incidents','Mediate student claims, disciplinary logs, and placement reassignment'],['chart','Monitor Compliance','Audit 100m geofenced DTR logs, breaks, and student training meters'],['file','Govern MOAs','Track document renewals, waivers, and institutional compliance'],['star','Generate Reports','Export 1-click CHED CMO 104 s. 2017 completion and compliance reports']];}return `<section class="role-info ${page==='students'?'maroon':''}"><p class="section-kicker reveal-on-scroll">${kicker}</p><h2 class="reveal-on-scroll">${title}</h2>${sub?`<p>${sub}</p>`:''}<div class="role-feature-grid reference-width">${items.map(([i,t,d])=>`<article><span class="feature-icon">${icon(i)}</span><div><h3>${t}</h3><p>${d}</p></div></article>`).join('')}</div>${page==='students'?`<div id="browse-interns" class="industry-list reference-width"><div style="text-align: center; margin-bottom: 40px;"><p class="section-kicker reveal-on-scroll">&mdash; Explore By Industry & Specialization &mdash;</p><h2 class="reveal-on-scroll">Find Internships Across Popular Fields</h2><p>Browse accredited host training establishments by domain, academic track, or career interest.</p></div>
<div class="marquee-container">
    <div class="marquee-track track-left">
        <a href="#/login">Design & UI/UX</a><a href="#/login">Marketing</a><a href="#/login">Others</a><a href="#/login">Computer and Technology</a><a href="#/login">Retail</a><a href="#/login">Finance</a><a href="#/login">Advertising and Marketing</a><a href="#/login">Design & UI/UX</a><a href="#/login">Marketing</a><a href="#/login">Others</a><a href="#/login">Computer and Technology</a><a href="#/login">Retail</a><a href="#/login">Finance</a><a href="#/login">Advertising and Marketing</a><a href="#/login">Design & UI/UX</a><a href="#/login">Marketing</a><a href="#/login">Others</a><a href="#/login">Computer and Technology</a><a href="#/login">Retail</a><a href="#/login">Finance</a><a href="#/login">Advertising and Marketing</a><a href="#/login">Design & UI/UX</a><a href="#/login">Marketing</a><a href="#/login">Others</a><a href="#/login">Computer and Technology</a><a href="#/login">Retail</a><a href="#/login">Finance</a><a href="#/login">Advertising and Marketing</a>
    </div>
    <div class="marquee-track track-right">
        <a href="#/login">Design</a><a href="#/login">Development</a><a href="#/login">Multimedia</a><a href="#/login">Software Engineering</a><a href="#/login">Supply Chain</a><a href="#/login">Administration</a><a href="#/login">Data Science / Analytics</a><a href="#/login">Design</a><a href="#/login">Development</a><a href="#/login">Multimedia</a><a href="#/login">Software Engineering</a><a href="#/login">Supply Chain</a><a href="#/login">Administration</a><a href="#/login">Data Science / Analytics</a><a href="#/login">Design</a><a href="#/login">Development</a><a href="#/login">Multimedia</a><a href="#/login">Software Engineering</a><a href="#/login">Supply Chain</a><a href="#/login">Administration</a><a href="#/login">Data Science / Analytics</a><a href="#/login">Design</a><a href="#/login">Development</a><a href="#/login">Multimedia</a><a href="#/login">Software Engineering</a><a href="#/login">Supply Chain</a><a href="#/login">Administration</a><a href="#/login">Data Science / Analytics</a>
    </div>
    <div class="marquee-track track-left">
        <a href="#/login">Human Resources</a><a href="#/login">Project Management</a><a href="#/login">Information Technology</a><a href="#/login">Customer Services</a><a href="#/login">Sales</a><a href="#/login">Business</a><a href="#/login">Research</a><a href="#/login">Human Resources</a><a href="#/login">Project Management</a><a href="#/login">Information Technology</a><a href="#/login">Customer Services</a><a href="#/login">Sales</a><a href="#/login">Business</a><a href="#/login">Research</a><a href="#/login">Human Resources</a><a href="#/login">Project Management</a><a href="#/login">Information Technology</a><a href="#/login">Customer Services</a><a href="#/login">Sales</a><a href="#/login">Business</a><a href="#/login">Research</a><a href="#/login">Human Resources</a><a href="#/login">Project Management</a><a href="#/login">Information Technology</a><a href="#/login">Customer Services</a><a href="#/login">Sales</a><a href="#/login">Business</a><a href="#/login">Research</a>
    </div>
</div></div>
  <section id="compliance-guide" class="ojt-success-guide reference-width" style="margin-top: 64px; padding-bottom: 64px;">
      <div style="text-align: center; margin-bottom: 48px;">
          <p class="guide-kicker">OJT Success Guide</p>
          <h2 class="guide-heading">Get Ready for Your OJT Journey</h2>
          <p class="guide-subtext">Essential steps to activate your account, track your geofenced training hours, and maintain OJT compliance on MenteeLog.</p>
      </div>
      
      <div class="guide-grid">
          <article class="guide-card reveal-on-scroll">
              <div class="guide-gradient">${icon('users')}</div>
              <div class="guide-content">
                  <span class="guide-subtitle">Account Activation & Placement</span>
                  <h3>Step 1: Activate Account & Apply for HTE Slots</h3>
                  <p class="excerpt">Activate your pre-seeded account with your SR Code and OTP, upload required clearance documents, and browse accredited Host Training Establishments (HTEs).</p>
                  
                  <button class="btn secondary guide-toggle">Read Guide ${icon('chevron-down')}</button>
                  <div class="guide-drawer">
                      <div class="guide-drawer-inner">
                          <div class="guide-drawer-content">
                              <ol>
                                  <li>Activate your pre-seeded account via OTP using your university SR Code and institutional email.</li>
                                  <li>Upload clearance documents (Medical Certificate, Parent Consent Waiver, and Endorsed MOA) in the Documents vault.</li>
                                  <li>Browse approved HTE partner slots in the Placement Directory and submit your application with resume attachment.</li>
                              </ol>
                              <a href="#/login" class="btn">Go to Placement Directory -></a>
                          </div>
                      </div>
                  </div>
              </div>
          </article>

          <article class="guide-card reveal-on-scroll">
              <div class="guide-gradient">${icon('clock')}</div>
              <div class="guide-content">
                  <span class="guide-subtitle">100m Geofenced Attendance & DTR</span>
                  <h3>Step 2: Automated Geofence Timekeeping</h3>
                  <p class="excerpt">Clock in directly within the accredited 100m workplace perimeter, track lunch breaks with live pause/resume, and auto-verify attendance on clock-out.</p>
                  
                  <button class="btn secondary guide-toggle">Read Guide ${icon('chevron-down')}</button>
                  <div class="guide-drawer">
                      <div class="guide-drawer-inner">
                          <div class="guide-drawer-content">
                              <ol>
                                  <li>Open the DTR Hub and clock in upon arrival—the system verifies your location against the company's accredited 100m geofence perimeter.</li>
                                  <li>Inspect your pinpoint position on the interactive Leaflet map or expand to wide-screen with ⛶ Fullscreen.</li>
                                  <li>Pause and resume for lunch or personal breaks with millisecond precision tracking and zero lost time.</li>
                                  <li>Clock out and submit your daily task summary (min. 150 characters)—on-site shifts are automatically verified directly!</li>
                              </ol>
                              <a href="#/login" class="btn">Open DTR Hub -></a>
                          </div>
                      </div>
                  </div>
              </div>
          </article>

          <article class="guide-card reveal-on-scroll">
              <div class="guide-gradient">${icon('star')}</div>
              <div class="guide-content">
                  <span class="guide-subtitle">Appraisals, Justifications & Clearance</span>
                  <h3>Step 3: Justify Anomalies & Complete Appraisals</h3>
                  <p class="excerpt">Submit justifications with clock-in map records for flagged shifts, and review your 7-criteria performance appraisal signed by your supervisor.</p>
                  
                  <button class="btn secondary guide-toggle">Read Guide ${icon('chevron-down')}</button>
                  <div class="guide-drawer">
                      <div class="guide-drawer-inner">
                          <div class="guide-drawer-content">
                              <ol>
                                  <li>If a shift is clocked outside the 100m perimeter, open the Attendance Justification modal to explain the anomaly and review your recorded clock-in map.</li>
                                  <li>Upon reaching required hours, your supervisor completes a 7-criteria performance appraisal with an authentic drawn digital signature.</li>
                                  <li>Review your evaluation rubric breakdown and digital signature directly in your Student Portal.</li>
                                  <li>Your faculty Coordinator verifies clearances and generates your 1-click CHED completion certificate.</li>
                              </ol>
                              <a href="#/login" class="btn">View Appraisal Hub -></a>
                          </div>
                      </div>
                  </div>
              </div>
          </article>
      </div>
  <div style="text-align: center; margin-top: 48px;"><a href="#/public/guide" style="color: #D85A63; font-weight: bold; text-decoration: none; font-size: 16px;">Browse all OJT Success Guides &rarr;</a></div>
  </section>
`:''}</section>`;}

function faqSection() {
    const faqs = [
        ['Is MenteeLog free for students and partner universities?', 'Yes! MenteeLog provides a centralized platform for OJT student interns, host company supervisors, and university coordinators to manage daily time records (DTR), placements, and performance appraisals seamlessly.'],
        ['How does MenteeLog ensure the validity of student DTR logs?', 'MenteeLog features automated 100-meter GPS geofencing with live Leaflet map verification, millisecond clock-in/out timers with break tracking, a 150-character daily task summary quality gate, and automated on-site status verification on clock-out with supervisor exception review.'],
        ['What user roles are supported on the platform?', 'MenteeLog features dedicated role-based portals for Students (SR Code access for automated geofenced DTR & logbooks), Company Supervisors (corporate email for candidate review, GPS attendance logs, and 7-criteria performance appraisals with canvas signatures), and University Coordinators (faculty ID for HTE accreditation, candidate placement, and 1-click CHED reports).'],
        ['How does MenteeLog handle disciplinary or workplace incident reports?', 'Students and supervisors can log incident claims directly with supporting evidence attachments. These automatically route into the Central Compliance Drawer (Incident & Compliance Hub) for coordinator review and resolution tracking.'],
        ['How do students get started on MenteeLog?', 'Students activate their pre-seeded accounts using their university SR Code and OTP, complete their profile setup, upload required clearance documents, and browse approved host establishment listings.']
    ];

    return `<section class="faq-section reveal-on-scroll">
        <h2 class="section-kicker faq-kicker">&mdash; Frequently Asked Questions &mdash;</h2>
        <div class="faq-container">
            ${faqs.map(([q, a]) => `
            <div class="faq-item">
                <button class="faq-header" aria-expanded="false">
                    <span class="faq-question">${q}</span>
                    <span class="faq-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </span>
                </button>
                <div class="faq-content">
                    <div class="faq-inner">
                        <p>${a}</p>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>
    </section>`;
}

function companyBody(icon){return `
        <section id="about-us" class="about-hero reveal-on-scroll">
            <p class="about-hero-kicker">ABOUT MENTEELOG</p>
            <h2>Bridging Academics and Industry through Seamless OJT Management</h2>
            <p class="about-hero-intro">MenteeLog is a centralized On-the-Job Training (OJT) management platform designed to streamline student internships, employer supervision, and university compliance. By unifying daily time tracking, incident reporting, and performance evaluations into one intelligent gateway, MenteeLog ensures transparency and efficiency across every step of the internship journey.</p>
        </section>

        <section class="about-grid-2">
            <article class="about-card reveal-on-scroll">
                <div class="about-card-icon">${icon('target')}</div>
                <h3>Our Mission</h3>
                <p>To provide a simple, reliable platform that helps students track their OJT hours while allowing schools and supervisors to easily monitor attendance and evaluate performance.</p>
            </article>
            <article class="about-card reveal-on-scroll">
                <div class="about-card-icon">${icon('eye')}</div>
                <h3>Our Vision</h3>
                <p>To create a seamless, stress-free OJT experience that connects students, schools, and companies in one easy-to-use digital workspace.</p>
            </article>
        </section>

        <section class="about-grid-3">
            <article class="about-card reveal-on-scroll" style="padding: 0; overflow: hidden; border-radius: 16px;">
                <div style="height: 200px; width: 100%;">
                    ${photo('supervisor')}
                </div>
                <div style="padding: 24px;">
                    <h3>Automated 100m Geofencing</h3>
                    <p>Automated 100-meter radius workplace boundary checks, interactive Leaflet pinpoint maps with fullscreen viewing, and quality-gated logbooks guarantee authentic attendance records.</p>
                </div>
            </article>
            <article class="about-card reveal-on-scroll" style="padding: 0; overflow: hidden; border-radius: 16px;">
                <div style="height: 200px; width: 100%;">
                    ${photo('company')}
                </div>
                <div style="padding: 24px;">
                    <h3>Centralized Compliance</h3>
                    <p>Dedicated Coordinator tools and Incident Hubs keep student clearances, accreditation records, and safety claims organized.</p>
                </div>
            </article>
            <article class="about-card reveal-on-scroll" style="padding: 0; overflow: hidden; border-radius: 16px;">
                <div style="height: 200px; width: 100%;">
                    ${photo('career')}
                </div>
                <div style="padding: 24px;">
                    <h3>Multi-Role Collaboration</h3>
                    <p>Tailored portals for Students, Supervisors, and Faculty Coordinators enable real-time messaging, evaluations, and instant approvals.</p>
                </div>
            </article>
        </section>

        <section class="about-stats-banner reveal-on-scroll">
            <div class="about-stats-grid">
                <div class="about-stat-item">
                    <h4>3</h4>
                    <p>Dedicated Role Portals<br>(Student, Supervisor, Coordinator)</p>
                </div>
                <div class="about-stat-item">
                    <h4>100m</h4>
                    <p>Accredited Workplace<br>Geofence Perimeter</p>
                </div>
                <div class="about-stat-item">
                    <h4>150+</h4>
                    <p>Min. Character Daily<br>Summary Quality Gate</p>
                </div>
            </div>
        </section>

        <section id="our-team" class="team-section maroon"><h2 class="reveal-on-scroll">THE TEAM BEHIND MENTEELOG</h2><p>Driven by Innovation: The Team Building Menteelog</p><div class="team-grid">${[['Jeff Gentapanan','Lead / Project Manager'],['Kyle Renzo Alis','Software Generalist'],['Sean Nicole Guipo','Backend Developer'],['John Paul Wendam','Frontend Developer'],['Jhodie Alyssa Ladran','Backend Developer'],['Cristina Bernadette Porras','UI/UX Designer'],['Rolly Abella','Researcher']].map(([n,r])=>`<article class="reveal-on-scroll"><img src="./assets/team/${n}.jpg" alt="${n}" class="reference-photo" style="height: 350px !important; object-fit: cover; object-position: top; width: 100%; border-radius: var(--radius); border-bottom-left-radius: 0; border-bottom-right-radius: 0;"><div><h3>${n}</h3><em>${r}</em><p style="display:flex;align-items:center;justify-content:center;gap:6px;font-size:13px;opacity:0.8"><svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Philippines</p><button class="btn" data-action="team-connect" data-id="${n}">Connect</button></div></article>`).join('')}</div></section>`;
}

function guideBody(icon) {
    const categories = [
        {
            title: "Phase 1: Setup & Placement",
            cards: [
                ['Activation', 'Account Activation & Profile Setup', 'Activate your pre-seeded student account using your SR Code and OTP, then verify your personal and academic details.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Click "Activate" on the navigation bar and enter your university SR Code and email.</li><li>Verify your identity using the 6-digit one-time PIN (OTP) sent to your inbox.</li><li>Set your secure account password and log in to your Student Portal.</li><li>Verify your academic program (e.g., BS Information Technology) and contact details.</li></ul>'],
                ['Placement', 'Browsing HTE Opportunities', 'Filter through accredited companies, check required skills, and find the perfect OJT match.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Open the OJT Placement directory from your dashboard.</li><li>Use the filters to sort by Location, Industry, or Work Mode (Remote/Hybrid/Onsite).</li><li>Review the "Required Skills" on each listing to ensure you meet the criteria.</li><li>Click "Apply" to send your profile directly to the industry supervisor.</li></ul>'],
                ['Applications', 'Application Tracking & Status', 'Monitor your application statuses from "Pending" to "Accepted" directly from the dashboard.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Access the "My Applications" tab to see real-time updates.</li><li>Applications transition through states: <strong>Pending -> Under Review -> Accepted</strong>.</li><li>Once a supervisor accepts you, your status updates and you are officially assigned to that company.</li></ul>'],
                ['Documents', 'Document Uploads & Clearance', 'Upload your signed MOAs, medical clearances, and waivers directly to the secure file vault.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Go to the Document Management Portal.</li><li>Upload required clearance documents (Medical Certificate, Parent Waiver, signed MOA).</li><li>Ensure files are in PDF, JPG, or PNG format and under 10 MB.</li><li>The Coordinator verifies and approves your documents prior to deployment.</li></ul>']
            ]
        },
        {
            title: "Phase 2: DTR & Daily Logs",
            cards: [
                ['Attendance', '100m GPS Geofence & Live Clock-In', 'Automated 100m geofencing verifies your arrival, renders your coordinates on Leaflet maps, and starts precision shift tracking.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Upon arriving at your workplace, launch the Attendance & DTR Hub and clock in.</li><li>Allow browser geolocation to pinpoint your exact coordinates against the 100m workplace perimeter.</li><li>Inspect your location pin and company boundary on the interactive Leaflet map, or expand it to fullscreen.</li><li>Track your rendered shift duration in real time with the live millisecond timer and break tracking controls.</li></ul>'],
                ['Task Summaries', 'Quality-Gated Daily Summaries', 'Best practices for writing your daily 150-character task summaries for supervisor verification.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Throughout your shift, draft your activities in the logbook (the hub automatically persists your draft so progress is never lost).</li><li>Before clocking out, compose your summary meeting the 150-character minimum quality gate detailing tasks, tools used, and technical learnings.</li><li>Submitting auto-verifies on-site records upon clock-out and updates your rendered hours immediately.</li><li>Supervisor receives verified daily logs for final compliance auditing.</li></ul>'],
                ['Compliance', 'Handling Flagged DTRs & Off-Site Exceptions', 'What occurs when clocking outside the 100m geofence or handling special work assignments.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Entries clocked outside the 100m company boundary or without GPS are flagged with location mismatch alerts.</li><li>Flagged entries are retained in your logbook and marked for supervisor justification review.</li><li>Open the Justification Modal on the flagged record to submit explanations (e.g., client site, fieldwork, signal loss).</li><li>Attach supporting notes or photos so your supervisor can review and validate your rendered hours.</li></ul>'],
                ['Justifications', 'Log Sheets & Hours Tracking', 'How cumulative rendered, required, and remaining hours are calculated and audited.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Monitor your rendered, required, and remaining hours in real-time from your student dashboard.</li><li>Every verified log automatically credits towards your curriculum target (e.g., 300 to 500 hours).</li><li>Review your historical attendance logs, break intervals, and map coordinates directly in your log table.</li><li>Supervisor and coordinator log sheets reflect real-time progress bars and attendance summaries.</li></ul>']
            ]
        },
        {
            title: "Phase 3: Evaluation & Governance",
            cards: [
                ['Appraisals', '7-Criteria Performance Appraisal Instrument', 'Comprehensive performance evaluations scored on a 5-point scale plus N/A with canvas digital signatures.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>At term completion, host supervisors evaluate interns across CHED-aligned performance dimensions using a 5-point rating scale plus N/A.</li><li>Covers Job Knowledge, Quality of Work, Dependability & Attendance, Initiative, Interpersonal Skills, Professional Attitude, and Communication.</li><li>Supervisors provide qualitative feedback and authenticate the evaluation using an interactive HTML5 draw canvas digital signature.</li><li>Interns can review their finalized scores, category breakdowns, and signed appraisal sheets instantly.</li></ul>'],
                ['Incidents', 'Filing Workplace Incident Reports', 'A step-by-step guide to reporting workplace issues, safety hazards, or disputes with evidence.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>If an issue occurs during deployment, open the Student Incident Module.</li><li>Draft a confidential, structured claim specifying incident date, location, description, and attach photographic or document evidence.</li><li>Submissions route directly to the university Coordinator\'s Incident & Compliance Hub for priority investigation.</li><li>Track case resolution status and updates safely within your portal.</li></ul>'],
                ['Mediation', 'Coordinator Mediation & Resolution', 'How the university tracks your incidents and mediates disputes between you and the company.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Coordinators use the Incident & Compliance Hub to monitor all claims and disciplinary cases.</li><li>They investigate, add case notes, schedule formal mediation conferences, and track resolutions.</li><li>If necessary, the coordinator can reassign the intern to ensure safety, well-being, and compliance.</li><li>All mediation actions and documentation are archived for institutional accountability.</li></ul>'],
                ['Sign-Off', 'Institutional Endorsement & CHED Reports', 'The final compliance review, clearance sign-offs, and 1-click CHED CMO 104 s. 2017 report generation.', '<ul style="margin-left: 20px; margin-bottom: 16px;"><li>Supervisors review and approve submitted hours and daily task summaries.</li><li>Coordinators conduct final audits of rendered hours, verified logs, and signed appraisal rubrics.</li><li>Clearance documents, waivers, and company evaluations are archived permanently in the cloud vault.</li><li>Faculty Coordinators export standardized 1-click completion summaries and institutional OJT reports compliant with CHED CMO 104 s. 2017.</li></ul>']
            ]
        }
    ];

    return `<section class="guide-full-page reference-width" style="padding: 64px 5%;">
        <div style="text-align: center; margin-bottom: 64px;">
            <p class="guide-kicker">&mdash; Knowledge Base &mdash;</p>
            <h2 class="guide-heading" style="font-size: 36px;">Master the MenteeLog Flow</h2>
            <p class="guide-subtext">Everything you need to know about navigating the modules, maintaining compliance, and succeeding in your OJT.</p>
        </div>
        
        ${categories.map(cat => `
            <div style="margin-bottom: 64px;">
                <h3 style="color: var(--burgundy); font-size: 24px; margin-bottom: 24px; border-bottom: 2px solid #EFDFBB; padding-bottom: 12px; text-align: center;">${cat.title}</h3>
                <div class="guide-grid">
                    ${cat.cards.map(([mod, title, desc, fullText]) => `
                        <article class="guide-card reveal-on-scroll" style="border: 1px solid var(--line); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;">
                            <div class="guide-content" style="padding: 28px 24px; display: flex; flex-direction: column; flex-grow: 1;">
                                <div style="width: 40px; height: 40px; background: #f5ebe0; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: var(--maroon);">
                                    ${icon('file')}
                                </div>
                                <h4 style="color: var(--burgundy); font-size: 17px; font-weight: 700; margin-bottom: 10px; line-height: 1.3;">${title}</h4>
                                <p class="excerpt" style="color: #4B5563; font-size: 14px; line-height: 1.6; margin-bottom: 16px; flex-grow: 1;">${desc}</p>
                                
                                <button class="btn secondary guide-toggle" style="width: 100%; justify-content: space-between; margin-top: auto;">Read Guide ${icon('chevron-down')}</button>
                                <div class="guide-drawer">
                                    <div class="guide-drawer-inner">
                                        <div class="guide-drawer-content" style="padding-top: 16px; font-size: 14px; color: #4B5563; text-align: left;">
                                            <p style="margin-bottom: 12px; font-weight: 600;">Instructions:</p>
                                            ${fullText}
                                            <a href="#/login" class="btn" style="width: 100%; text-align: center;">Open Portal & Apply -></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </section>`;
}
export function authScreen(mode,role,{brand,icon,field,hasRecoverySession}){
  const activate=mode==='activate',reset=mode==='reset-password',forgot=mode==='forgot',authError=mode==='auth-error';
  return `<div class="auth-reference">
    <section class="auth-reference-photo">${photo('group','auth-photo')}<div class="auth-tint"></div><img class="auth-watermark" src="./assets/MenteeLog_Logo.svg" alt=""><h1>Join the MenteeLog<br>Journey.<br>Step Forward into<br>Your Future.</h1><span class="auth-rule"></span><p>${icon('shield')} Official Student Mentorship Network</p></section>
    <main class="auth-reference-main" id="main">
      <div class="auth-map-backdrop" aria-hidden="true">
        <div class="auth-map-grid"></div>
        <svg class="auth-map-svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="clockGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#58111A" stop-opacity="0.12" />
              <stop offset="70%" stop-color="#FAF4E8" stop-opacity="0.02" />
              <stop offset="100%" stop-color="#FAF4E8" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="shiftArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#059669" stop-opacity="0.8" />
              <stop offset="50%" stop-color="#EAB308" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#D85A63" stop-opacity="0.85" />
            </linearGradient>
          </defs>

          <!-- TECHNICAL DTR CLOCK MECHANISM centered at (230, 360) -->
          <g class="clock-mechanism" transform="translate(230, 360)">
            <!-- Outer subtle technical rings -->
            <circle cx="0" cy="0" r="210" class="clock-ring-outer" />
            <circle cx="0" cy="0" r="165" class="clock-ring-mid" />
            <circle cx="0" cy="0" r="135" class="clock-ring-track" />

            <!-- Clock dial background -->
            <circle cx="0" cy="0" r="120" fill="url(#clockGlow)" class="clock-face-base" />

            <!-- Rendered Shift Arc from 8:00 AM (-120deg) to 5:00 PM (+150deg) -->
            <path d="M-104,-60 A120,120 0 1,1 104,60" fill="none" stroke="url(#shiftArcGrad)" stroke-width="5" stroke-linecap="round" class="clock-arc-glow" />

            <!-- 12 Hour tick marks & 60-second dash ring -->
            <circle cx="0" cy="0" r="112" class="clock-dash-ring" />
            <g class="clock-ticks">
              <line x1="0" y1="-120" x2="0" y2="-106" class="tick-hour" />
              <line x1="60" y1="-104" x2="52" y2="-90" class="tick-hour" />
              <line x1="104" y1="-60" x2="90" y2="-52" class="tick-hour" />
              <line x1="120" y1="0" x2="106" y2="0" class="tick-hour" />
              <line x1="104" y1="60" x2="90" y2="52" class="tick-hour" />
              <line x1="60" y1="104" x2="52" y2="90" class="tick-hour" />
              <line x1="0" y1="120" x2="0" y2="106" class="tick-hour" />
              <line x1="-60" y1="104" x2="-52" y2="90" class="tick-hour" />
              <line x1="-104" y1="60" x2="-90" y2="52" class="tick-hour" />
              <line x1="-120" y1="0" x2="-106" y2="0" class="tick-hour" />
              <line x1="-104" y1="-60" x2="-90" y2="-52" class="tick-hour" />
              <line x1="-60" y1="-104" x2="-52" y2="-90" class="tick-hour" />

              <text x="0" y="-86" class="clock-num" text-anchor="middle">12</text>
              <text x="94" y="4" class="clock-num" text-anchor="middle">3</text>
              <text x="0" y="98" class="clock-num" text-anchor="middle">6</text>
              <text x="-94" y="4" class="clock-num" text-anchor="middle">9</text>
            </g>

            <!-- CLOCK IN PIN at 8:00 AM (-104, -60) -->
            <g class="clock-pin-in" transform="translate(-104, -60)">
              <circle cx="0" cy="0" r="5" fill="#059669" />
              <circle cx="0" cy="0" r="10" class="clock-pulse-in" />
              <rect x="-132" y="-22" width="124" height="22" rx="11" class="clock-badge-bg in" />
              <text x="-70" y="-7" class="clock-badge-text in" text-anchor="middle">● CLOCK IN (08:00 AM)</text>
            </g>

            <!-- CLOCK OUT PIN at 5:00 PM (104, 60) -->
            <g class="clock-pin-out" transform="translate(104, 60)">
              <circle cx="0" cy="0" r="5" fill="#D85A63" />
              <circle cx="0" cy="0" r="10" class="clock-pulse-out" />
              <rect x="8" y="2" width="134" height="22" rx="11" class="clock-badge-bg out" />
              <text x="75" y="17" class="clock-badge-text out" text-anchor="middle">● CLOCK OUT (05:00 PM)</text>
            </g>

            <!-- Animated Hour Hand (Slow) -->
            <g class="clock-hand-hour">
              <line x1="0" y1="12" x2="0" y2="-55" class="hand-hour-line" />
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="360s" repeatCount="indefinite" />
            </g>

            <!-- Animated Minute Hand -->
            <g class="clock-hand-minute">
              <line x1="0" y1="16" x2="0" y2="-82" class="hand-minute-line" />
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="60s" repeatCount="indefinite" />
            </g>

            <!-- Animated Second Hand (Smooth sweep with accent tip) -->
            <g class="clock-hand-second">
              <line x1="0" y1="22" x2="0" y2="-100" class="hand-second-line" />
              <circle cx="0" cy="-100" r="3.5" fill="#D85A63" />
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="12s" repeatCount="indefinite" />
            </g>

            <!-- Center Pivot Cap -->
            <circle cx="0" cy="0" r="7" class="hand-pivot-outer" />
            <circle cx="0" cy="0" r="3" class="hand-pivot-inner" />

            <!-- Timekeeper captions -->
            <text x="0" y="152" class="clock-caption" text-anchor="middle">DIGITAL TIMEKEEPING & DTR</text>
            <text x="0" y="170" class="clock-subcaption" text-anchor="middle">AUTOMATED CLOCK IN / CLOCK OUT</text>
          </g>

          <!-- Technical Grid intersection crosshairs "+" and corner markers -->
          <g class="map-crosshairs">
            <path d="M60,60 m-10,0 h20 m-10,-10 v20" />
            <text x="75" y="64" class="crosshair-coord">GRID-01 · NORTH SECTOR</text>

            <path d="M1140,60 m-10,0 h20 m-10,-10 v20" />
            <text x="980" y="64" class="crosshair-coord">GRID-02 · EAST SECTOR</text>

            <path d="M60,840 m-10,0 h20 m-10,-10 v20" />
            <text x="75" y="844" class="crosshair-coord">GRID-03 · SOUTH SECTOR</text>

            <path d="M1140,840 m-10,0 h20 m-10,-10 v20" />
            <text x="980" y="844" class="crosshair-coord">GRID-04 · SYSTEM LOCK</text>

            <path d="M600,60 m-8,0 h16 m-8,-8 v16" />
            <path d="M600,840 m-8,0 h16 m-8,-8 v16" />
            <path d="M60,450 m-8,0 h16 m-8,-8 v16" />
            <path d="M1140,450 m-8,0 h16 m-8,-8 v16" />
          </g>
        </svg>

        <div class="map-hud-top">
          <span class="hud-item hud-live"><span class="hud-dot"></span> LIVE TIMEKEEPER ACTIVE</span>
          <span class="hud-item hud-mono">DTR SYSTEM · AUTOMATED ATTENDANCE TRACKER</span>
          <span class="hud-item hud-chip">CHED CMO COMPLIANT</span>
        </div>

        <div class="map-hud-bottom">
          <span class="hud-item hud-mono">DIGITAL TIME LOGGING · CLOCK IN / CLOCK OUT HUB</span>
          <span class="hud-item">STATE UNIVERSITY OJT PORTAL</span>
        </div>
      </div>
      <div class="auth-orb auth-orb-1" aria-hidden="true"></div>
      <div class="auth-orb auth-orb-2" aria-hidden="true"></div>
      <div class="auth-orb auth-orb-3" aria-hidden="true"></div>

      <div class="auth-floating-badge badge-tr" aria-hidden="true">
        <span class="badge-pulse-dot"></span>
        <div class="badge-text">
          <strong>CHED CMO Verified</strong>
          <small>OJT Hours Compliance</small>
        </div>
      </div>

      <div class="auth-floating-badge badge-bl" aria-hidden="true">
        <svg class="badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <div class="badge-text">
          <strong>Clock In / Clock Out</strong>
          <small>Automated DTR Timekeeping</small>
        </div>
      </div>

      <div class="auth-floating-badge badge-br" aria-hidden="true">
        <svg class="badge-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <div class="badge-text">
          <strong>3 Connected Portals</strong>
          <small>Role-Isolated DTR Access</small>
        </div>
      </div>

      <section class="auth-reference-card">
        <header>
          ${brand()}
          <h2>${activate?'Activate Your MenteeLog Account':reset?(hasRecoverySession?'Reset Your Password':'Password Reset Link Needed'):forgot?'Forgot Password?':authError?'Link Expired':'MenteeLog - Authentication Hub'}</h2>
          <p>${activate?'Complete the steps below to set up your account':reset?(hasRecoverySession?'Enter a new password for your account':'To protect your account, a valid reset link from your email is required.'):forgot?'Enter your email or SR code to reset your password':authError?'This reset link is invalid or has expired. Please request a new one.':'Select your role to continue'}</p>
        </header>
        <div class="auth-reference-body">
          ${activate?
            `<div id="step1-container"><p class="auth-role-label">I AM A...</p><div class="activation-roles">${['Student','Supervisor'].map(r=>`<button type="button" class="btn ${role===r?'':'secondary'}" data-action="auth-role" data-id="${r}">${icon(r==='Student'?'users':'building')} ${r}</button>`).join('')}</div><form id="activation-form">${field(role==='Supervisor'?'CORPORATE EMAIL':'SR CODE','identifier',role==='Supervisor'?'email':'text','','required')}${role==='Supervisor' ? '' : field('REGISTERED EMAIL ADDRESS','email','email','','required')}<p class="form-error" role="alert"></p><button type="submit" class="btn full">Send Activation Code</button></form><a class="auth-return" href="#" data-action="login">&larr; Back to Login</a></div>` +
`<div id="step2-container" style="display:none;"><form id="verify-otp-form"><div style="text-align:center;margin-bottom:24px;"><p style="font-size:14px;color:#555;margin-bottom:4px;">We sent a 6-digit code to</p><strong id="otp-email-display" style="color:var(--maroon);font-size:15px;"></strong><p style="font-size:12px;color:#888;margin-top:8px;">Check your inbox and spam folder.</p></div><div class="field"><label for="otp-code">6-DIGIT CODE</label><input id="otp-code" name="otp" type="text" inputmode="numeric" maxlength="6" required autocomplete="one-time-code" placeholder="000000" style="letter-spacing:0.3em;font-size:24px;text-align:center;font-weight:700;"></div><p class="form-error" role="alert"></p><button type="submit" class="btn full">Verify Code &rarr;</button><button type="button" class="auth-return" onclick="document.getElementById(\'step2-container\').style.display=\'none\';document.getElementById(\'step1-container\').style.display=\'block\';" style="background:none;border:none;cursor:pointer;width:100%;font-family:inherit;margin-top:10px;">&larr; Back</button></form></div>` +
`<div id="step3-container" style="display:none;"><form id="set-password-form"><div style="text-align:center;margin-bottom:24px;"><p style="font-size:14px;color:#555;">Almost done! Create a secure password for your account.</p></div><div class="field"><label for="new-password">CREATE PASSWORD</label><div class="password-field"><input id="new-password" name="password" type="password" required minlength="8" placeholder="Minimum 8 characters" autocomplete="new-password"><button type="button" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button></div></div><div class="field"><label for="confirm-password">CONFIRM PASSWORD</label><div class="password-field"><input id="confirm-password" name="confirm" type="password" required minlength="8" placeholder="Re-enter your password" autocomplete="new-password"><button type="button" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button></div></div><p class="form-error" role="alert"></p><button type="submit" class="btn full">Complete Activation</button></form></div>` +
`<div id="activate-success" style="display:none;text-align:center;padding:20px 0;"><svg width="56" height="56" fill="none" stroke="#2d6a4f" stroke-width="2" viewBox="0 0 24 24" style="margin:0 auto 16px;display:block;"><circle cx="12" cy="12" r="10"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"></path></svg><h3 style="color:#2d6a4f;margin-bottom:8px;">Account Activated!</h3><p style="font-size:14px;color:#555;margin-bottom:24px;">Your account is ready. You can now log in with your new password.</p><a href="#/login" class="btn full">Go to Login &rarr;</a></div>`
          : reset?
            (hasRecoverySession ?
            `<form id="reset-password-form">
               <div class="field"><label for="password">NEW PASSWORD</label><div class="password-field"><input id="password" name="password" type="password" required minlength="8" autocomplete="new-password"><button type="button" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button></div></div>
               <div class="field"><label for="confirm">CONFIRM PASSWORD</label><div class="password-field"><input id="confirm" name="confirm" type="password" required minlength="8" autocomplete="new-password"><button type="button" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button></div></div>
               <p class="form-error" role="alert"></p>
               <button type="submit" class="btn full">Save New Password</button>
             </form>
             <a class="auth-return" href="#" data-action="forgot">&larr; Back to Forgot Password</a>`
            :
            `<div style="text-align:center;padding:12px 0;">
               <p style="color:#555;font-size:14px;line-height:1.5;margin-bottom:20px;">No active reset session found. Please click the reset link sent to your email, or request a new one below.</p>
               <button type="button" class="btn full" onclick="location.hash='/forgot'">Request Reset Link &rarr;</button>
             </div>
             <a class="auth-return" href="#/login" style="display:block;margin-top:1.25rem;text-align:center;">&larr; Back to Login</a>`
            )
          : forgot?
            `<form id="forgot-form">
               ${field('EMAIL OR SR CODE','identifier','text','','required')}
               <p class="form-error" role="alert"></p>
               <button type="submit" class="btn full">Send Reset Link</button>
             </form>
             <a class="auth-return" href="#" data-action="login">&larr; Back to Login</a>`
          : authError?
            `<button type="button" class="btn full" onclick="location.hash='/forgot'">Request New Link</button>
             <a class="auth-return" href="#/login" style="display:block;margin-top:1rem;text-align:center;">&larr; Back to Login</a>`
          :
            `<div class="auth-tabs" role="group" aria-label="Authentication portals">${['Student','Supervisor','Coordinator'].map(r=>`<button class="${r===role?'selected':''}" data-action="auth-role" data-id="${r}" aria-pressed="${r===role}">${icon(r==='Student'?'users':r==='Supervisor'?'building':'users')} ${r}</button>`).join('')}</div>
            <div class="auth-role-banner">
              <div class="role-badge-icon">${icon(role==='Student'?'users':role==='Supervisor'?'building':'users')}</div>
              <div class="role-badge-info">
                <small>CURRENT PORTAL</small>
                <strong>${role === 'Student' ? 'OJT Student Intern' : role === 'Supervisor' ? 'Industry Partner Supervisor' : 'Faculty OJT Coordinator'}</strong>
              </div>
              <span class="role-active-pulse" title="Portal Active"></span>
            </div>
            <form id="login-form">
              ${field(role==='Student'?'SR CODE':role==='Supervisor'?'CORPORATE EMAIL':'FACULTY ID','identifier',role==='Supervisor'?'email':'text','','required autocomplete="username"')}
              <div class="field">
                <label for="password">PASSWORD</label>
                <div class="password-field">
                  <input id="password" name="password" type="password" required autocomplete="current-password">
                  <button type="button" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button>
                </div>
              </div>
              <button type="button" class="forgot-link" data-action="forgot">Forgot Password?</button>
              <p class="form-error" role="alert"></p>
              <button class="btn full auth-submit-btn" type="submit">
                <span>Login as ${role}</span>
                <svg class="btn-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </form>
            ${role === "Coordinator" ? "" : `<div class="auth-activate-box"><p class="activate-link">First time here? <a href="#/activate">Activate ${role} Account &rarr;</a></p></div>`}
            <a class="auth-return" href="#/">&larr; Back to Landing Page</a>
            <div class="auth-card-security" aria-hidden="true">
              <span class="auth-decor-line"></span>
              <span class="decor-dot dot-coral"></span>
              <span class="auth-system-name">MenteeLog OJT System</span>
              <span class="decor-dot dot-burgundy"></span>
              <span class="auth-decor-line"></span>
            </div>`
          }
        </div>
      </section>
    </main>
  </div>`;
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    const authMain = document.querySelector('.auth-reference-main');
    if (!authMain) return;
    const rect = authMain.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    authMain.style.setProperty('--spotlight-x', `${x}px`);
    authMain.style.setProperty('--spotlight-y', `${y}px`);
  }, { passive: true });
}
