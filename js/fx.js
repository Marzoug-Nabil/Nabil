/**
 * Interactive effects for the black theme:
 * scroll progress, custom cursor, card spotlight + 3D tilt,
 * magnetic buttons, typing text, count-up stats, scroll reveal,
 * and publication filters.
 */
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    ready(() => {
        // ---------- Scroll progress ----------
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // ---------- Custom cursor ----------
        if (finePointer && !reduceMotion) {
            const dot = document.createElement('div');
            const ring = document.createElement('div');
            dot.className = 'cursor-dot';
            ring.className = 'cursor-ring';
            document.body.append(dot, ring);
            let mx = 0, my = 0, rx = 0, ry = 0;
            window.addEventListener('mousemove', (e) => {
                mx = e.clientX; my = e.clientY;
                dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
                document.body.classList.add('has-cursor');
            });
            document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));
            (function loop() {
                rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
                ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
                requestAnimationFrame(loop);
            })();
            document.addEventListener('mouseover', (e) => {
                const hit = e.target.closest('a, button, .tag, .skill-tag, .tilt');
                document.body.classList.toggle('cursor-hover', !!hit);
            });
        }

        // ---------- Card spotlight + tilt ----------
        const cards = document.querySelectorAll(
            '.spec-card, .work-card, .pub-card, .pub-item, .publication-entry, .timeline-content, ' +
            '.skill-category, .cert-card, .blog-entry, .contact-item, .resource-card, .edu-card'
        );
        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left, y = e.clientY - r.top;
                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);
                if (finePointer && !reduceMotion && card.classList.contains('tilt')) {
                    const rotY = ((x / r.width) - 0.5) * 8;
                    const rotX = ((y / r.height) - 0.5) * -8;
                    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
                }
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });

        // ---------- Magnetic buttons ----------
        if (finePointer && !reduceMotion) {
            document.querySelectorAll('.btn, .social-btn, .footer-social a, .filter-btn').forEach((el) => {
                el.addEventListener('mousemove', (e) => {
                    const r = el.getBoundingClientRect();
                    const x = e.clientX - (r.left + r.width / 2);
                    const y = e.clientY - (r.top + r.height / 2);
                    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
                });
                el.addEventListener('mouseleave', () => { el.style.transform = ''; });
            });
        }

        // ---------- Typing effect ----------
        document.querySelectorAll('.typed[data-words]').forEach((el) => {
            const words = el.dataset.words.split('|');
            if (reduceMotion) { el.textContent = words[0]; return; }
            let w = 0, i = 0, deleting = false;
            (function tick() {
                const word = words[w];
                el.textContent = word.slice(0, i);
                if (!deleting && i < word.length) { i++; setTimeout(tick, 70); }
                else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
                else if (i > 0) { i--; setTimeout(tick, 35); }
                else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
            })();
        });

        // ---------- Count-up stats ----------
        const counters = document.querySelectorAll('.stat-num[data-count]');
        const runCount = (el) => {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            if (reduceMotion) { el.textContent = target + suffix; return; }
            const start = performance.now(), dur = 1400;
            (function step(now) {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
                if (p < 1) requestAnimationFrame(step);
            })(start);
        };

        // ---------- Scroll reveal ----------
        const revealTargets = document.querySelectorAll(
            '.section-title, .about-content p, .publication-entry, .pub-card, .pub-item, .edu-card, ' +
            '.stats-row, .pub-filters, .blog-entry, .resource-card, .interests-box, .page-header .container'
        );
        if ('IntersectionObserver' in window) {
            revealTargets.forEach((el) => el.classList.add('reveal'));
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            revealTargets.forEach((el) => io.observe(el));

            const co = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    runCount(entry.target);
                    co.unobserve(entry.target);
                });
            }, { threshold: 0.5 });
            counters.forEach((el) => co.observe(el));
        } else {
            counters.forEach(runCount);
        }

        // ---------- Publication filters ----------
        const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterBtns.forEach((b) => b.classList.toggle('active', b === btn));
                const f = btn.dataset.filter;
                document.querySelectorAll('.publication-entry[data-type]').forEach((card) => {
                    const show = f === 'all' || card.dataset.type === f;
                    card.classList.toggle('is-hidden', !show);
                    if (show) { card.classList.add('in'); }
                });
            });
        });
    });
})();
