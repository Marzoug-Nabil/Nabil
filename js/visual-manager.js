/**
 * Unified Visual Manager
 * Consolidates all 4 visual layers into a single rendering method:
 * 1. Canvas Background Layer (particles, gradient, shapes, connections)
 * 2. DOM Interaction Layer (scroll animations, navbar effects, menu)
 * 3. CSS Animation Layer (handled by CSS keyframes)
 * 4. Chatbot Visual Layer (kept separate as a feature module)
 */

class UnifiedVisualManager {
    constructor() {
        // Canvas Layer Properties
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.gradientOffset = 0;

        // DOM Layer Properties
        this.hamburger = null;
        this.navMenu = null;
        this.navbar = null;
        this.lastScroll = 0;
        this.observer = null;

        // Initialize all layers
        this.init();
    }

    /**
     * Initialize all visual layers
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeLayers());
        } else {
            this.initializeLayers();
        }
    }

    /**
     * Initialize all visual rendering layers
     */
    initializeLayers() {
        this.initCanvasLayer();
        this.initDOMLayer();
        this.initScrollAnimations();
        this.initSmoothScroll();
        this.initLoadAnimations();
        this.initEmailCopy();

        // Start unified rendering loop
        this.render();
    }

    // ==========================================
    // CANVAS LAYER - Background Effects
    // ==========================================

    initCanvasLayer() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'interactive-bg';
        this.ctx = this.canvas.getContext('2d');

        // Insert canvas as first child of body
        document.body.insertBefore(this.canvas, document.body.firstChild);

        // Set canvas size
        this.resizeCanvas();

        // Create particles
        this.createParticles();

        // Event listeners for canvas
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseout', () => this.handleMouseOut());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Recreate particles on resize
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);

        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.5;
            const hue = Math.random() * 100 + 185; // Cyan to violet range

            this.particles.push({
                x,
                y,
                size,
                speedX,
                speedY,
                hue,
                originalX: x,
                originalY: y
            });
        }
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    handleMouseOut() {
        this.mouse.x = null;
        this.mouse.y = null;
    }

    drawGradientBackground() {
        // Pure black base with slow-drifting aurora glows
        this.gradientOffset += 0.003;
        const w = this.canvas.width, h = this.canvas.height, t = this.gradientOffset;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, w, h);

        const glows = [
            { x: w * (0.15 + 0.08 * Math.sin(t)),       y: h * (0.2 + 0.06 * Math.cos(t * 0.8)), r: Math.max(w, h) * 0.45, c: '34, 211, 238', a: 0.10 },
            { x: w * (0.85 + 0.06 * Math.cos(t * 0.7)), y: h * (0.7 + 0.08 * Math.sin(t * 0.9)), r: Math.max(w, h) * 0.5,  c: '168, 85, 247', a: 0.11 },
            { x: w * (0.5 + 0.1 * Math.sin(t * 0.5)),   y: h * (1.05),                            r: Math.max(w, h) * 0.4,  c: '236, 72, 153', a: 0.06 }
        ];
        glows.forEach(g => {
            const grad = this.ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
            grad.addColorStop(0, `rgba(${g.c}, ${g.a})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, w, h);
        });

        // Soft spotlight that follows the mouse
        if (this.mouse.x !== null) {
            const spot = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, 260);
            spot.addColorStop(0, 'rgba(120, 160, 255, 0.10)');
            spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = spot;
            this.ctx.fillRect(0, 0, w, h);
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.x -= Math.cos(angle) * force * 3;
                    particle.y -= Math.sin(angle) * force * 3;
                }
            }

            // Return to original position slowly
            particle.x += (particle.originalX - particle.x) * 0.02;
            particle.y += (particle.originalY - particle.y) * 0.02;

            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, 0.8)`;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `hsla(${particle.hue}, 80%, 60%, 0.5)`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    drawConnections() {
        const maxDistance = 120;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(140, 160, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawMouseLinks() {
        if (this.mouse.x === null) return;
        const maxD = 180;
        this.particles.forEach(p => {
            const dx = p.x - this.mouse.x, dy = p.y - this.mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < maxD) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - d / maxD) * 0.45})`;
                this.ctx.lineWidth = 0.7;
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(p.x, p.y);
                this.ctx.stroke();
            }
        });
    }

    drawFloatingShapes() {
        const time = Date.now() * 0.001;

        // Draw floating geometric shapes (hexagons)
        for (let i = 0; i < 3; i++) {
            const x = this.canvas.width * 0.2 + Math.sin(time * 0.5 + i * 2) * 100;
            const y = this.canvas.height * 0.3 + Math.cos(time * 0.3 + i * 2) * 100 + i * 200;
            const size = 60 + Math.sin(time + i) * 20;
            const rotation = time * 0.5 + i;
            const opacity = 0.1 + Math.sin(time * 2 + i) * 0.05;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);

            // Draw hexagon
            this.ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI / 3) * j;
                const px = Math.cos(angle) * size;
                const py = Math.sin(angle) * size;
                if (j === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            this.ctx.closePath();
            this.ctx.strokeStyle = `rgba(100, 180, 255, ${opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.restore();
        }

        // Draw floating circles
        for (let i = 0; i < 2; i++) {
            const x = this.canvas.width * 0.7 + Math.cos(time * 0.4 + i * 3) * 150;
            const y = this.canvas.height * 0.5 + Math.sin(time * 0.6 + i * 3) * 150;
            const size = 40 + Math.sin(time * 1.5 + i) * 15;
            const opacity = 0.08 + Math.cos(time * 2 + i) * 0.04;

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(150, 100, 255, ${opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    /**
     * Render all canvas elements in a single method
     */
    renderCanvas() {
        this.drawGradientBackground();
        this.drawFloatingShapes();
        this.drawConnections();
        this.drawMouseLinks();
        this.drawParticles();
    }

    // ==========================================
    // DOM LAYER - Interactive Elements
    // ==========================================

    initDOMLayer() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navbar = document.getElementById('navbar');

        // Mobile menu toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

            // Close menu when clicking on a link
            const navLinks = this.navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.updateNavbarEffect());
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');

        // Animate hamburger icon
        const spans = this.hamburger.querySelectorAll('span');
        if (this.navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        const spans = this.hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    updateNavbarEffect() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            this.navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }

        this.lastScroll = currentScroll;
    }

    // ==========================================
    // SCROLL ANIMATIONS LAYER
    // ==========================================

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation
        const elementsToAnimate = document.querySelectorAll('.spec-card, .work-card, .timeline-item, .skill-category, .cert-card, .edu-card, .blog-entry, .contact-item, .resource-card');
        elementsToAnimate.forEach(el => this.observer.observe(el));

        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // ==========================================
    // LOAD ANIMATIONS
    // ==========================================

    initLoadAnimations() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    // ==========================================
    // EMAIL COPY FUNCTIONALITY
    // ==========================================

    initEmailCopy() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('contextmenu', (e) => {
                const email = link.getAttribute('href').replace('mailto:', '');
                this.copyToClipboard(email);
            });
        });
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Create temporary notification
            const notification = document.createElement('div');
            notification.textContent = 'Email copied to clipboard!';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        });
    }

    // ==========================================
    // UNIFIED RENDER METHOD
    // Single rendering loop for all visual layers
    // ==========================================

    render() {
        // Render canvas layer (particles, gradients, shapes)
        this.renderCanvas();

        // Continue animation loop
        this.animationId = requestAnimationFrame(() => this.render());
    }

    // ==========================================
    // CLEANUP
    // ==========================================

    destroy() {
        // Cancel animation frame
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Remove event listeners
        window.removeEventListener('resize', () => this.resizeCanvas());
        window.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.removeEventListener('mouseout', () => this.handleMouseOut());
        window.removeEventListener('scroll', () => this.updateNavbarEffect());
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c👋 Hello! Thanks for visiting my portfolio!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cInterested in collaboration? Reach out at nabilmarzoug7@gmail.com', 'color: #6b7280; font-size: 12px;');

// ==========================================
// INITIALIZE UNIFIED VISUAL MANAGER
// ==========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new UnifiedVisualManager();
    });
} else {
    new UnifiedVisualManager();
}
