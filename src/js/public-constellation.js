/**
 * Public Constellation & Academic Network Background Animation
 * MenteeLog OJT Platform - Connected Student, HTE & Academic Journey Motif
 */

let animId = null;
let resizeHandler = null;
let mouseMoveHandler = null;
let mouseLeaveHandler = null;
let scrollHandler = null;

export function initPublicConstellation() {
    // 1. Clean up any existing instances first
    destroyPublicConstellation();

    const canvas = document.getElementById('public-constellation-canvas');
    if (!canvas) return;

    const container = canvas.closest('.public-constellation-layer') || canvas.parentElement;
    if (!container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let scrollY = window.scrollY || 0;
    let mouse = { x: -1000, y: -1000, active: false, idleTimer: null };

    // High-DPI screen scaling
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
        ctx.scale(dpr, dpr);
    }
    resize();
    resizeHandler = resize;
    window.addEventListener('resize', resizeHandler, { passive: true });

    // Track mouse over public canvas
    mouseMoveHandler = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;

        if (mouse.idleTimer) clearTimeout(mouse.idleTimer);
        mouse.idleTimer = setTimeout(() => {
            mouse.active = false;
        }, 3000);
    };
    mouseLeaveHandler = () => {
        mouse.active = false;
    };
    window.addEventListener('mousemove', mouseMoveHandler, { passive: true });
    window.addEventListener('mouseleave', mouseLeaveHandler, { passive: true });

    // Track scroll with responsive parallax nudge
    let lastScrollY = window.scrollY || 0;
    scrollHandler = () => {
        const curScrollY = window.scrollY || 0;
        const delta = curScrollY - lastScrollY;
        lastScrollY = curScrollY;

        // Parallax vertical movement so nodes drift naturally with page scroll
        const nudge = Math.max(-30, Math.min(30, delta * 0.22));
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].y -= nudge;
            if (nodes[i].y < -40) nodes[i].y = height + 40;
            else if (nodes[i].y > height + 40) nodes[i].y = -40;
        }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Node count: responsive scaling with rich density
    const isMobile = width < 768;
    const nodeCount = isMobile ? 24 : 48;

    const nodeTypes = [
        { type: 'student', radius: 2.8, color: 'rgba(88, 17, 26, 0.45)', label: 'Intern' },
        { type: 'hte', radius: 4.5, color: 'rgba(216, 90, 99, 0.75)', label: 'HTE Partner' },
        { type: 'acad', radius: 4.0, color: 'rgba(88, 17, 26, 0.7)', label: 'CHED / BatState-U' },
        { type: 'dtr', radius: 3.2, color: 'rgba(5, 150, 105, 0.65)', label: 'DTR Verified' }
    ];

    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        const typeConfig = (i % 7 === 0) ? nodeTypes[1] // HTE hub
                         : (i % 7 === 2) ? nodeTypes[2] // Academic hub
                         : (i % 7 === 4) ? nodeTypes[3] // DTR verified hub
                         : nodeTypes[0];                // Student intern

        const hasLabel = (i < 8); // First 8 key hub nodes show subtle architectural badges

        // Distribute initial positions evenly across viewport height with natural jitter
        const sliceY = (height / nodeCount) * i;
        const yPos = (sliceY + (Math.random() - 0.5) * (height / nodeCount * 1.5) + height) % height;

        nodes.push({
            x: Math.random() * width,
            y: yPos,
            baseX: 0,
            baseY: 0,
            vx: (Math.random() - 0.5) * 0.32,
            vy: (Math.random() - 0.5) * 0.32,
            radius: typeConfig.radius,
            color: typeConfig.color,
            type: typeConfig.type,
            label: hasLabel ? typeConfig.label : null,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.02
        });
    }

    // Dynamic data packets (traveling pulses between connected nodes)
    const packets = [];
    function spawnPacket(fromNode, toNode) {
        if (packets.length >= 7) return;
        packets.push({
            from: fromNode,
            to: toNode,
            progress: 0,
            speed: 0.008 + Math.random() * 0.008,
            color: fromNode.type === 'hte' ? '#D85A63' : fromNode.type === 'dtr' ? '#059669' : '#58111A'
        });
    }

    let lastPacketSpawn = 0;
    const maxDistance = isMobile ? 120 : 160;

    // Animation Render Loop
    function render(timestamp) {
        // Stop if canvas has been detached
        if (!document.body.contains(canvas)) {
            destroyPublicConstellation();
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // 1. Update and connect nodes
        const activeConnections = [];

        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];

            // Gentle autonomous drift
            n.x += n.vx;
            n.y += n.vy;

            // Soft screen boundary wrapping with padding
            if (n.x < -40) n.x = width + 40;
            else if (n.x > width + 40) n.x = -40;
            if (n.y < -40) n.y = height + 40;
            else if (n.y > height + 40) n.y = -40;

            // Interactive mouse attraction
            if (mouse.active) {
                const mdx = mouse.x - n.x;
                const mdy = mouse.y - n.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 140 && mdist > 5) {
                    const force = (1 - mdist / 140) * 0.025;
                    n.x += mdx * force;
                    n.y += mdy * force;
                }
            }

            // Find neighbors within distance
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    activeConnections.push({ n1: n, n2: n2, dist: dist });
                }
            }
        }

        // 2. Draw Connection Lines
        for (let k = 0; k < activeConnections.length; k++) {
            const conn = activeConnections[k];
            const alpha = (1 - conn.dist / maxDistance) * 0.16;

            ctx.beginPath();
            ctx.moveTo(conn.n1.x, conn.n1.y);
            ctx.lineTo(conn.n2.x, conn.n2.y);

            if (conn.n1.type === 'hte' || conn.n2.type === 'hte') {
                ctx.strokeStyle = `rgba(216, 90, 99, ${alpha * 1.2})`;
                ctx.lineWidth = 0.9;
            } else if (conn.n1.type === 'dtr' || conn.n2.type === 'dtr') {
                ctx.strokeStyle = `rgba(5, 150, 105, ${alpha * 1.1})`;
                ctx.lineWidth = 0.8;
            } else {
                ctx.strokeStyle = `rgba(88, 17, 26, ${alpha})`;
                ctx.lineWidth = 0.75;
            }
            ctx.stroke();
        }

        // 3. Draw Lines to Active Mouse Cursor
        if (mouse.active) {
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const mAlpha = (1 - dist / 130) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(216, 90, 99, ${mAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // 4. Periodically spawn traveling data packet
        if (timestamp - lastPacketSpawn > 1800 && activeConnections.length > 0) {
            const randomConn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
            spawnPacket(randomConn.n1, randomConn.n2);
            lastPacketSpawn = timestamp;
        }

        // 5. Update and Draw Traveling Data Packets
        for (let pIdx = packets.length - 1; pIdx >= 0; pIdx--) {
            const pkt = packets[pIdx];
            pkt.progress += pkt.speed;

            if (pkt.progress >= 1) {
                packets.splice(pIdx, 1);
                continue;
            }

            const curX = pkt.from.x + (pkt.to.x - pkt.from.x) * pkt.progress;
            const curY = pkt.from.y + (pkt.to.y - pkt.from.y) * pkt.progress;

            // Glow core
            ctx.beginPath();
            ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = pkt.color;
            ctx.fill();

            // Glow aura
            ctx.beginPath();
            ctx.arc(curX, curY, 5, 0, Math.PI * 2);
            ctx.fillStyle = pkt.color === '#D85A63' ? 'rgba(216, 90, 99, 0.3)' : 'rgba(88, 17, 26, 0.2)';
            ctx.fill();
        }

        // 6. Draw Nodes & Badges
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.pulsePhase += n.pulseSpeed;
            const pulseFactor = Math.sin(n.pulsePhase);

            // Core node dot
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.fill();

            // Hub outer pulse rings (HTE & Academic hubs)
            if (n.type === 'hte' || n.type === 'acad' || n.type === 'dtr') {
                const ringRadius = n.radius + 3.5 + pulseFactor * 1.5;
                const ringAlpha = 0.25 + pulseFactor * 0.12;

                ctx.beginPath();
                ctx.arc(n.x, n.y, ringRadius, 0, Math.PI * 2);
                ctx.strokeStyle = n.type === 'hte' 
                    ? `rgba(216, 90, 99, ${ringAlpha})` 
                    : n.type === 'dtr'
                    ? `rgba(5, 150, 105, ${ringAlpha})`
                    : `rgba(88, 17, 26, ${ringAlpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Faint center crosshair tick for university hubs
                if (n.type === 'acad') {
                    ctx.beginPath();
                    ctx.moveTo(n.x - 3, n.y);
                    ctx.lineTo(n.x + 3, n.y);
                    ctx.moveTo(n.x, n.y - 3);
                    ctx.lineTo(n.x, n.y + 3);
                    ctx.strokeStyle = 'rgba(88, 17, 26, 0.3)';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Subtle Architectural Pill Badge (only on desktop and select hub nodes)
            if (n.label && !isMobile) {
                const labelText = n.label;
                ctx.font = '600 9px system-ui, -apple-system, sans-serif';
                const metrics = ctx.measureText(labelText);
                const padX = 6;
                const boxW = metrics.width + padX * 2;
                const boxH = 14;
                const boxX = n.x + 8;
                const boxY = n.y - boxH / 2;

                // Pill background
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(boxX, boxY, boxW, boxH, 7);
                } else {
                    ctx.rect(boxX, boxY, boxW, boxH);
                }
                ctx.fillStyle = 'rgba(250, 244, 232, 0.88)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(88, 17, 26, 0.18)';
                ctx.lineWidth = 0.75;
                ctx.stroke();

                // Pill text
                ctx.fillStyle = 'rgba(88, 17, 26, 0.7)';
                ctx.fillText(labelText, boxX + padX, boxY + 10.5);
            }
        }

        // Loop next frame (unless reduced motion is active)
        if (!prefersReducedMotion) {
            animId = requestAnimationFrame(render);
        }
    }

    // Start loop
    animId = requestAnimationFrame(render);
}

export function destroyPublicConstellation() {
    if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
    }
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
    if (mouseMoveHandler) {
        window.removeEventListener('mousemove', mouseMoveHandler);
        mouseMoveHandler = null;
    }
    if (mouseLeaveHandler) {
        window.removeEventListener('mouseleave', mouseLeaveHandler);
        mouseLeaveHandler = null;
    }
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
    }
}
