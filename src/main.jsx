import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/styles.css'
import './css/reference.css'
import './css/portal-reference.css'
import './css/portal-layout.css'
import './css/animations.css'
import './js/app.js'

// Force scroll to top on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

// Global Scroll Shadow Logic
window.addEventListener('scroll', () => {
  const headers = document.querySelectorAll('.reference-header, .topbar');
  headers.forEach(h => {
    if (window.scrollY > 40) {
      h.classList.add('scrolled-header');
    } else {
      h.classList.remove('scrolled-header');
    }
  });
});

// HMR-Safe Scroll Reveal Observer
if (!window.revealObserver) {
    window.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                window.revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    window.initScrollReveals = () => {
        document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach(el => {
            window.revealObserver.observe(el);
        });
    };

    window.domObserver = new MutationObserver(window.initScrollReveals);
    window.domObserver.observe(document.body, { childList: true, subtree: true });
}
window.initScrollReveals();


// FAQ Accordion Logic
document.addEventListener('click', (e) => {
    const header = e.target.closest('.faq-header');
    if (!header) return;
    const item = header.closest('.faq-item');
    const container = item.closest('.faq-container');
    
    // Toggle current item
    const isOpen = item.classList.contains('open');
    
    // Close all other items for that smooth "only one open" accordion feel
    container.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
    });
    
    if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
    }
});


// Guide Drawer Toggle Logic
document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.guide-toggle');
    if (!toggle) return;
    const card = toggle.closest('.guide-card');
    card.classList.toggle('expanded');
});

ReactDOM.createRoot(document.getElementById('react-root')).render(
  <React.StrictMode>
    {/* React tree is empty for now. The app.js script is taking over #app manually */}
  </React.StrictMode>,
)
