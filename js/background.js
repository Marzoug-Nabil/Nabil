/**
 * Fancy Interactive Background
 * Features: Particle system, gradient animations, mouse interactions
 */

class InteractiveBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.gradientOffset = 0;

        this.init();
    }

    init() {
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

        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseout', () => this.handleMouseOut());

        // Start animation
        this.animate();
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
            const hue = Math.random() * 60 + 200; // Blue/purple range

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
        // Animated gradient background
        this.gradientOffset += 0.0005;

        const gradient = this.ctx.createLinearGradient(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Create shifting gradient colors
        const hue1 = 220 + Math.sin(this.gradientOffset) * 20;
        const hue2 = 260 + Math.cos(this.gradientOffset * 1.5) * 20;

        gradient.addColorStop(0, `hsla(${hue1}, 70%, 15%, 1)`);
        gradient.addColorStop(0.5, `hsla(${hue2}, 60%, 10%, 1)`);
        gradient.addColorStop(1, `hsla(${hue1 + 20}, 70%, 12%, 1)`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
                    this.ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawFloatingShapes() {
        const time = Date.now() * 0.001;

        // Draw floating geometric shapes
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

    animate() {
        // Clear and redraw
        this.drawGradientBackground();
        this.drawFloatingShapes();
        this.drawConnections();
        this.drawParticles();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
        window.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.removeEventListener('mouseout', () => this.handleMouseOut());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new InteractiveBackground();
    });
} else {
    new InteractiveBackground();
}
