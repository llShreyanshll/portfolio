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
let   dark   = true;

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
        'Python','Java','RAG','LLMs','NLP','PyTorch','TensorFlow',
        'LangChain','GCP','AWS','Azure','SQL','Computer Vision',
        'Scikit-learn','BigQuery','Hugging Face','CrewAI','Weaviate',
        'Time Series','Apache Spark','Multi-Agent','XGBoost','FAISS',
        'Feature Engineering','PostgreSQL','Embeddings','ETL','Keras',
        'Spring Boot','Prophet','Microservices'
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

    // ── Skills popup ─────────────────────────────────────────
    const SKILL_CATS = [
        { title: 'ML & AI SYSTEMS',     skills: ['RAG','LLMs','NLP','Computer Vision','Time Series','Multi-Agent','Embeddings','Feature Engineering'] },
        { title: 'FRAMEWORKS & TOOLS',  skills: ['PyTorch','TensorFlow','Scikit-learn','Keras','LangChain','CrewAI','Hugging Face','XGBoost','Prophet','FAISS','Weaviate'] },
        { title: 'CLOUD & DATA',        skills: ['GCP','AWS','Azure','BigQuery','Apache Spark','PostgreSQL','ETL'] },
        { title: 'LANGUAGES & BACKEND', skills: ['Python','SQL','Java','Spring Boot','Microservices'] },
    ];
    const popup = document.createElement('div');
    popup.className = 'skills-popup';
    popup.innerHTML = `
        <div class="skills-popup-card">
            <div class="skills-popup-header">
                <span class="skills-popup-label">02 — SKILLS</span>
                <button class="skills-popup-close" aria-label="Close">✕</button>
            </div>
            <div class="skills-popup-grid">
                ${SKILL_CATS.map(cat => `
                <div class="spg-group">
                    <span class="spg-title">${cat.title}</span>
                    <div class="spg-pills">${cat.skills.map(s => `<span>${s}</span>`).join('')}</div>
                </div>`).join('')}
            </div>
        </div>`;
    wrap.appendChild(popup);

    const showPopup = () => popup.classList.add('active');
    const hidePopup = () => popup.classList.remove('active');
    popup.addEventListener('click', hidePopup);
    popup.querySelector('.skills-popup-card').addEventListener('click', e => e.stopPropagation());
    popup.querySelector('.skills-popup-close').addEventListener('click', hidePopup);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hidePopup(); });

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
    let prevHoverForPopup = -1, hoverTimer = null;

    canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouseX = -999; mouseY = -999; hoverIdx = -1;
        canvas.style.cursor = 'default';
        clearTimeout(hoverTimer);
        prevHoverForPopup = -1;
    });
    canvas.addEventListener('click', () => {
        if (hoverIdx !== -1) showPopup();
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
            bg:    dk ? 'rgba(239,239,235,0.06)' : 'rgba(17,17,17,0.05)',
            bd:    dk ? 'rgba(239,239,235,0.20)' : 'rgba(17,17,17,0.15)',
            txt:   dk ? 'rgba(239,239,235,0.65)' : 'rgba(17,17,17,0.62)',
            ln:    dk ? '239,239,235'            : '17,17,17',
            hi:    dk ? '#FAEA5C'                : '#111111',
            hiTxt: dk ? '#FAEA5C'                : '#EFEFEB',
            hiBg:  dk ? 'rgba(250,234,92,0.12)'  : 'rgba(17,17,17,1)',
            hiRgb: dk ? '250,234,92'             : '17,17,17',
        };
    }

    function drawPill(n, c, hi) {
        ctx.beginPath();
        ctx.roundRect(n.x, n.y, n.w, n.h, n.h / 2);
        ctx.fillStyle   = hi ? c.hiBg : c.bg;
        ctx.strokeStyle = hi ? c.hi : c.bd;
        ctx.lineWidth   = hi ? 1.5 : 1;
        ctx.fill(); ctx.stroke();
        ctx.font = FONT;
        ctx.fillStyle    = hi ? c.hiTxt : c.txt;
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
        canvas.style.cursor = hoverIdx !== -1 ? 'pointer' : 'default';

        // 3s hover timer → show popup
        if (hoverIdx !== prevHoverForPopup) {
            clearTimeout(hoverTimer);
            prevHoverForPopup = hoverIdx;
            if (hoverIdx !== -1) hoverTimer = setTimeout(showPopup, 3000);
        }

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

        // AABB collision — push pills apart so they never overlap
        const GAP = 6;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const ox = Math.min(a.x + a.w + GAP - b.x, b.x + b.w + GAP - a.x);
                const oy = Math.min(a.y + a.h + GAP - b.y, b.y + b.h + GAP - a.y);
                if (ox <= 0 || oy <= 0) continue;
                if (ox < oy) {
                    const push = ox * 0.3;
                    if (a.x + a.w / 2 < b.x + b.w / 2) { a.x -= push; b.x += push; }
                    else                                  { a.x += push; b.x -= push; }
                    const t = ox * 0.015;
                    a.angle -= t; b.angle += t;
                } else {
                    const push = oy * 0.3;
                    if (a.y + a.h / 2 < b.y + b.h / 2) { a.y -= push; b.y += push; }
                    else                                  { a.y += push; b.y -= push; }
                    const t = oy * 0.015;
                    a.angle -= t; b.angle += t;
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
                ctx.strokeStyle = hi ? `rgba(${c.hiRgb},${t * 0.7})` : `rgba(${c.ln},${t * 0.35})`;
                ctx.lineWidth = hi ? 1.5 : 0.8;
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
            }
        }

        // Pills
        nodes.forEach((n, i) => drawPill(n, c, i === hiIdx || i === hoverIdx));
    })();
}());

// ── Experience popup cards ──────────────────────────────────
(function () {

    const EXP_DATA = {
        droisys: {
            num: '01',
            role: 'AI/ML Engineer',
            company: 'Droisys · Las Vegas, NV · 02/2026 — Present',
            sections: [
                {
                    title: 'Observability & Logging',
                    bullets: [
                        'Replaced System.out.println and printStackTrace() with SLF4J structured logging across 22 Java files spanning GUIManager, ETL pipeline, and RuleEngineService',
                        'Configured Logback rolling file appender (wdts-guimanager-service.log) providing persistent, searchable audit trails across service restarts',
                        'Applied @Slf4j annotation pattern with parameterized logging to eliminate string concatenation overhead and surface context-rich log events',
                    ]
                },
                {
                    title: 'Player Network Detection',
                    bullets: [
                        'Designed a graph-based detection system for coordinated casino floor activity using chip transfer signals (value, frequency, directionality), co-play session overlap, and cash proximity',
                        'Engineered 5 network classification types — Parental, Radiant, Collaborative, Peer-to-Peer, and unknown — each with distinct structural signatures',
                        'Built confidence scoring with network density and stability metrics to surface the highest-risk player clusters for investigator review',
                    ]
                },
                {
                    title: 'Alert Explanation System',
                    bullets: [
                        'Built AlertExplanationHelper — a stateless utility generating human-readable alert narratives from gameData and alertConfiguration JSON, evaluated entirely at read-time',
                        'Eliminated the need for a new database column: explanation logic is derived on the fly, carrying zero migration risk across deployed environments',
                        'Example output: [Blackjack] High Spread Detected: raw score 4.75 over 62 hands; avg bet at TC≥3 is $250 vs TC≤0 is $25',
                    ]
                },
                {
                    title: 'Backend & APIs',
                    bullets: [
                        'Contributed to the TableGuard Web API exposing JWT-secured REST endpoints for casino surveillance workflows across frontend and operator tooling',
                        'Supported ETL and rule-engine pipelines that ingest and transform raw table game data into real-time risk signals consumed downstream',
                    ]
                },
            ]
        },
        chieac: {
            num: '02',
            role: 'Lead Data Analyst',
            company: 'Chicago Education Advocacy Cooperative · Remote · 03/2025 — 02/2026',
            sections: [
                {
                    title: 'Multi-Agent AI Tutor',
                    bullets: [
                        'Architected a modular multi-agent tutoring platform with dedicated agents for explanation, quiz generation, and revision assistance using LangChain and CrewAI',
                        'Ran A/B tests against static PDF delivery — achieved 30% higher learner score gains and 35% lift in engagement across active sessions',
                        'Closed a prompt feedback loop: logged repeat queries → flagged recurring failure patterns → adjusted agent prompts — reducing repetitive errors by 25%',
                    ]
                },
                {
                    title: 'RAG Pipeline & Retrieval',
                    bullets: [
                        'Built a scalable RAG pipeline using all-MiniLM-L6-v2 embeddings with recursive text chunking and metadata-aware filtering for topic-precise retrieval',
                        'Selected Weaviate over ChromaDB for its hybrid keyword + semantic search and superior metadata filtering, cutting topic confusion by 42%',
                        'Reduced API costs by 90% through intelligent retrieval routing, context compression, and caching of high-frequency query patterns',
                    ]
                },
                {
                    title: 'Document Processing',
                    bullets: [
                        'Built intelligent document processing achieving 98% extraction accuracy across diverse educational materials including PDFs, scanned docs, and structured forms',
                        'Applied vision-based OCR for non-digitized content and structured output pipelines for downstream agent consumption',
                    ]
                },
            ]
        },
        nexdigm: {
            num: '03',
            role: 'Data Scientist',
            company: 'Nexdigm · Gurugram, India · 08/2022 — 06/2023',
            sections: [
                {
                    title: 'Forecasting Platform',
                    bullets: [
                        'Led development of a Python-based time series accelerator supporting ARIMA, SARIMA, SARIMAX, VARMAX, and RNN ensemble models with automated model selection',
                        'Automated hyperparameter tuning across 50+ iterations per dataset — cut client delivery time from 3 weeks to 4 days (70% reduction)',
                        'Improved model accuracy by 12% through iterative feature engineering, cross-validation pipelines, and systematic lag/seasonality testing',
                    ]
                },
                {
                    title: 'Explainability & Reporting',
                    bullets: [
                        'Built an explanation module that logs the selected model, MAPE/RMSE scores, and performance vs alternative models — giving stakeholders audit-ready rationale for every forecast',
                        'Automated client-facing reports with embedded model diagnostics, reducing analyst prep time per engagement by over 60%',
                    ]
                },
                {
                    title: 'Impact',
                    bullets: [
                        'Tool adopted as a firm-wide forecasting accelerator, deployed across multiple client engagements spanning retail, FMCG, and financial services verticals',
                        'Drove +15% client engagement improvement through automated, explainable forecasts that replaced manual slide decks',
                        'Cut exploratory analysis time by 70%, freeing analyst bandwidth for higher-order modelling and client advisory work',
                    ]
                },
            ]
        },
        transorg: {
            num: '04',
            role: 'Data Analyst Intern',
            company: 'TransOrg Analytics · Gurugram, India · 02/2022 — 06/2022',
            sections: [
                {
                    title: 'Sales Forecasting',
                    bullets: [
                        'Built ARIMA and Prophet models for weekly sales prediction at SKU level — reduced overstock by 12% and stockouts by 9% through more accurate demand signals',
                        'Validated model selection with rolling-window backtests and MAPE comparisons across seasonal and trend-dominant SKU categories',
                    ]
                },
                {
                    title: 'Customer Segmentation',
                    bullets: [
                        'Developed K-Means and DBSCAN customer segments using RFM (Recency, Frequency, Monetary) features, validated with silhouette scoring to confirm cluster quality',
                        'Applied SMOTE for class imbalance and Boruta/Lasso for feature selection — achieved 87% purchase prediction accuracy for targeted campaign targeting',
                        'Personalized campaigns built on these segments drove +18% repeat purchase rates across the active customer base',
                    ]
                },
                {
                    title: 'Semantic Search',
                    bullets: [
                        'Implemented all-MiniLM-L6-v2 + FAISS cosine similarity semantic search to replace keyword-based product discovery',
                        'Delivered +30% session duration uplift attributed to contextually relevant product recommendations replacing exact-match retrieval',
                    ]
                },
            ]
        },
    };

    // Build popup HTML
    const expPopup = document.createElement('div');
    expPopup.id = 'expPopup';
    expPopup.className = 'exp-popup';
    expPopup.innerHTML = `
        <div class="exp-popup-card" id="expPopupCard">
            <div class="exp-popup-header">
                <div class="exp-popup-meta">
                    <span class="exp-popup-num" id="epNum"></span>
                    <div class="exp-popup-title-group">
                        <span class="exp-popup-role" id="epRole"></span>
                        <span class="exp-popup-company" id="epCompany"></span>
                    </div>
                </div>
                <button class="exp-popup-close" id="expPopupClose" aria-label="Close">✕</button>
            </div>
            <div class="exp-popup-body" id="epBody"></div>
        </div>`;
    document.body.appendChild(expPopup);

    const epNum     = document.getElementById('epNum');
    const epRole    = document.getElementById('epRole');
    const epCompany = document.getElementById('epCompany');
    const epBody    = document.getElementById('epBody');

    function openExpPopup(key) {
        const d = EXP_DATA[key];
        if (!d) return;
        epNum.textContent     = d.num;
        epRole.textContent    = d.role;
        epCompany.textContent = d.company;
        epBody.innerHTML = d.sections.map(s => `
            <div class="epb-group">
                <span class="epb-title">${s.title}</span>
                <ul class="epb-list">
                    ${s.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>`).join('');
        expPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeExpPopup() {
        expPopup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Trigger on exp-item click or 3s stationary hover
    document.querySelectorAll('.exp-item[data-exp]').forEach(item => {
        let expHoverTimer = null;
        item.addEventListener('click', () => openExpPopup(item.dataset.exp));
        item.addEventListener('mouseenter', () => {
            expHoverTimer = setTimeout(() => openExpPopup(item.dataset.exp), 3000);
        });
        item.addEventListener('mouseleave', () => {
            clearTimeout(expHoverTimer);
        });
    });

    // Close handlers
    expPopup.addEventListener('click', closeExpPopup);
    document.getElementById('expPopupCard').addEventListener('click', e => e.stopPropagation());
    document.getElementById('expPopupClose').addEventListener('click', closeExpPopup);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeExpPopup(); });

}());
