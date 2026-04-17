/* ============================================================
   SHREYANSH KUMAR — PORTFOLIO SCRIPT
   ============================================================ */

'use strict';

// ── Custom cursor ───────────────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mx = 0, my = 0;
let fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});

(function animateFollower() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
})();

// Scale cursor on hover over interactive elements
document.querySelectorAll(
    'a, button, .project-card, .exp-item, .cert-item, .skill-tags span'
).forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '0.6';
});

// ── Dark mode toggle ────────────────────────────────────────
const toggle = document.getElementById('themeToggle');
const html   = document.documentElement;
let   dark   = false;

toggle.addEventListener('click', () => {
    dark = !dark;
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    toggle.textContent = dark ? 'LIGHT MODE' : 'DARK MODE';
});

// ── Intersection Observer — scroll reveal ───────────────────
const revealItems = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Stagger siblings within the same parent
        const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
        );
        const idx = siblings.indexOf(entry.target);
        const delay = Math.max(0, idx * 75);

        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);

        revealObs.unobserve(entry.target);
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px',
});

revealItems.forEach(el => revealObs.observe(el));

// ── About lead paragraph ────────────────────────────────────
const aboutLead = document.querySelector('.about-lead');
if (aboutLead) {
    const leadObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                leadObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    leadObs.observe(aboutLead);
}

// ── About meta items — staggered ────────────────────────────
const metaItems = document.querySelectorAll('.meta-item');
if (metaItems.length) {
    const metaObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const all = Array.from(document.querySelectorAll('.meta-item'));
            const i   = all.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 100);
            metaObs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });
    metaItems.forEach(el => metaObs.observe(el));
}

// ── Smooth scroll for anchor links ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── Nav: subtle background opacity shift on scroll ──────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        nav.style.backdropFilter = 'blur(14px)';
        nav.style.webkitBackdropFilter = 'blur(14px)';
    } else {
        nav.style.backdropFilter = 'none';
        nav.style.webkitBackdropFilter = 'none';
    }
}, { passive: true });

// ── Metric values: pop-in animation on scroll ───────────────
const statVals = document.querySelectorAll('.stat-val');
const statObs  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity   = '0';
        el.style.transform = 'scale(0.75)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        setTimeout(() => {
            el.style.opacity   = '1';
            el.style.transform = 'scale(1)';
        }, 150);
        statObs.unobserve(el);
    });
}, { threshold: 0.6 });
statVals.forEach(el => statObs.observe(el));
