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

// ── roundRect polyfill (Safari < 15.4) ──────────────────────
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.arcTo(x + w, y, x + w, y + r, r);
        this.lineTo(x + w, y + h - r);
        this.arcTo(x + w, y + h, x + w - r, y + h, r);
        this.lineTo(x + r, y + h);
        this.arcTo(x, y + h, x, y + h - r, r);
        this.lineTo(x, y + r);
        this.arcTo(x, y, x + r, y, r);
        this.closePath();
    };
}

// ── Skills network canvas ───────────────────────────────────
(function () {
    const wrap = document.getElementById('aboutSkillsFloat');
    if (!wrap) return;

    const SKILLS = [
        'Python','RAG','LLMs','NLP','PyTorch','TensorFlow',
        'LangChain','GCP','AWS','Azure','SQL','Computer Vision',
        'Scikit-learn','BigQuery','Hugging Face','CrewAI',
        'Time Series','Apache Spark','Multi-Agent','XGBoost',
        'Feature Engineering','PostgreSQL','Embeddings','ETL','Keras'
    ];

    const PILL_H = 28;
    const PAD_X  = 14;
    const FONT   = '500 11px "Space Grotesk", sans-serif';
    const SPEED  = 0.12;
    const CONN_D = 145;
    const YELLOW = '#FAEA5C';
    const EDGE   = 26;

    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    ctx.font = FONT;
    const nodes = SKILLS.map(label => ({
        label,
        w: ctx.measureText(label).width + PAD_X * 2,
        h: PILL_H,
        x: 0, y: 0,
        angle: Math.random() * Math.PI * 2,
    }));

    let W = 0, H = 0, ready = false;
    let mouseX = -999, mouseY = -999, hoverIdx = -1;

    canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouseX = -999; mouseY = -999; hoverIdx = -1;
        canvas.style.cursor = 'default';
    });

    function scatter() {
        const iW = W - EDGE * 2, iH = H - EDGE * 2;
        const cols = Math.max(1, Math.round(Math.sqrt(nodes.length * iW / iH)));
        const rows = Math.ceil(nodes.length / cols);
        const cw = iW / cols, ch = iH / rows;
        // Shuffle so grid order feels random
        const order = [...Array(nodes.length).keys()].sort(() => Math.random() - 0.5);
        order.forEach((ni, i) => {
            const n = nodes[ni];
            const col = i % cols, row = Math.floor(i / cols);
            n.x = EDGE + col * cw + Math.random() * Math.max(0, cw - n.w);
            n.y = EDGE + row * ch + Math.random() * Math.max(0, ch - n.h);
            n.angle = Math.random() * Math.PI * 2;
        });
    }

    // ResizeObserver fires after layout — contentRect dimensions are always correct
    new ResizeObserver(entries => {
        const r = entries[0].contentRect;
        if (r.width < 10 || r.height < 10) return;
        W = r.width; H = r.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width  = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
        if (!ready) { scatter(); ready = true; }
    }).observe(wrap);

    let hiIdx = -1;

    function colors() {
        const dk = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            bg:  dk ? 'rgba(239,239,235,0.06)' : 'rgba(17,17,17,0.05)',
            bd:  dk ? 'rgba(239,239,235,0.20)' : 'rgba(17,17,17,0.15)',
            txt: dk ? 'rgba(239,239,235,0.65)' : 'rgba(17,17,17,0.62)',
            ln:  dk ? '239,239,235'            : '17,17,17',
        };
    }

    function drawPill(n, c, hi) {
        ctx.beginPath();
        ctx.roundRect(n.x, n.y, n.w, n.h, n.h / 2);
        ctx.fillStyle   = hi ? 'rgba(250,234,92,0.12)' : c.bg;
        ctx.strokeStyle = hi ? YELLOW : c.bd;
        ctx.lineWidth   = hi ? 1.5 : 1;
        ctx.fill(); ctx.stroke();
        ctx.font = FONT;
        ctx.fillStyle    = hi ? YELLOW : c.txt;
        ctx.textBaseline = 'middle';
        ctx.textAlign    = 'left';
        ctx.fillText(n.label, n.x + PAD_X, n.y + n.h / 2);
    }

    (function loop() {
        requestAnimationFrame(loop);
        if (!ready) return;

        ctx.clearRect(0, 0, W, H);
        const c = colors();

        // Detect hover
        hoverIdx = -1;
        nodes.forEach((n, i) => {
            if (mouseX >= n.x && mouseX <= n.x + n.w &&
                mouseY >= n.y && mouseY <= n.y + n.h) {
                hoverIdx = i;
            }
        });
        canvas.style.cursor = hoverIdx !== -1 ? 'default' : 'default';

        // Move
        nodes.forEach(n => {
            n.angle += (Math.random() - 0.5) * 0.018;
            n.x += Math.cos(n.angle) * SPEED;
            n.y += Math.sin(n.angle) * SPEED;
            if (n.x < EDGE)           { n.x = EDGE;           n.angle = Math.PI - n.angle; }
            if (n.y < EDGE)           { n.y = EDGE;           n.angle = -n.angle; }
            if (n.x + n.w > W - EDGE) { n.x = W - n.w - EDGE; n.angle = Math.PI - n.angle; }
            if (n.y + n.h > H - EDGE) { n.y = H - n.h - EDGE; n.angle = -n.angle; }
        });

        // Soft separation via angle steering (no position jumps)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = (a.x + a.w / 2) - (b.x + b.w / 2);
                const dy = (a.y + a.h / 2) - (b.y + b.h / 2);
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const need = (a.w + b.w) / 2 + 10;
                if (dist < need) {
                    const t = (need - dist) / need * 0.06;
                    a.angle += t; b.angle -= t;
                }
            }
        }

        // Lines
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
                const bx = b.x + b.w / 2, by = b.y + b.h / 2;
                const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
                if (d > CONN_D) continue;
                const t = 1 - d / CONN_D;
                const hi = i === hiIdx || j === hiIdx || i === hoverIdx || j === hoverIdx;
                ctx.strokeStyle = hi ? `rgba(250,234,92,${t * 0.7})` : `rgba(${c.ln},${t * 0.35})`;
                ctx.lineWidth = hi ? 1.5 : 0.8;
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
            }
        }

        // Pills
        nodes.forEach((n, i) => drawPill(n, c, i === hiIdx || i === hoverIdx));
    })();
}());
