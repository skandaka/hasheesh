/* ============================================
   HA SHEESH - MASTER SCRIPT (PHASE 2 INTEGRATED)
   ============================================ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global Variables
let lenis;
let cursorBig, cursorSmall;
let magneticElements;
// Phase 2: Filter elements
let displacementMap;

/* ============================================
   1. LENIS SMOOTH SCROLL & PHYSICS LOOP
   ============================================ */
function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Get the SVG filter primitive
    displacementMap = document.querySelector('#displacement-map');

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // PHYSICS LOOP
    lenis.on('scroll', ({ velocity }) => {
        const skewAmount = velocity * 0.05;

        // 1. Skew Effect (Geometric)
        gsap.to('.hero-bloom__pen img, .collection__pen img', {
            skewY: skewAmount,
            rotateZ: -skewAmount * 0.2,
            overwrite: true,
            duration: 0.1,
            ease: 'power1.out'
        });

        // 2. Text Skew
        gsap.to('.kinetic-text', {
            skewX: -skewAmount * 0.1,
            overwrite: true,
            duration: 0.1
        });

        // 3. PHASE 2: LIQUID DISTORTION (Organic)
        // Map velocity to filter scale. Max scale restricted to 50 for visuals.
        if (displacementMap) {
            const liquidScale = Math.abs(velocity) * 1.5;
            gsap.to(displacementMap, {
                attr: { scale: Math.min(liquidScale, 60) },
                duration: 0.1,
                ease: 'power1.out'
            });
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;
            lenis.scrollTo(href);
        });
    });
}

/* ============================================
   PHASE 2: HERO 3D PARALLAX (Holographic Effect)
   ============================================ */
function initHeroParallax() {
    const container = document.querySelector('.hero-bloom__container');
    const pensContainer = document.querySelector('.hero-bloom__pens');

    if (!container || !pensContainer) return;

    container.addEventListener('mousemove', (e) => {
        // Calculate position relative to center (-1 to 1)
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;

        // Apply 3D rotation based on mouse position
        // RotateY handles horizontal movement (tilts left/right)
        // RotateX handles vertical movement (tilts up/down)
        gsap.to(pensContainer, {
            rotationY: x * 15, // 15 degrees max tilt
            rotationX: -y * 10,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Reset on mouse leave
    container.addEventListener('mouseleave', () => {
        gsap.to(pensContainer, {
            rotationY: 0,
            rotationX: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });
}

/* ============================================
   2. MAGNETIC CURSOR SYSTEM
   ============================================ */
function initCursor() {
    cursorBig = document.querySelector('.cursor__ball--big');
    cursorSmall = document.querySelector('.cursor__ball--small');
    magneticElements = document.querySelectorAll('[data-magnetic]');

    const mouse = { x: 0, y: 0 };
    const bigPos = { x: 0, y: 0 };
    const smallPos = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        gsap.to([cursorBig, cursorSmall], { opacity: 1, duration: 0.3 });
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
        smallPos.x += (mouse.x - smallPos.x) * 0.5;
        smallPos.y += (mouse.y - smallPos.y) * 0.5;
        bigPos.x += (mouse.x - bigPos.x) * dt;
        bigPos.y += (mouse.y - bigPos.y) * dt;

        gsap.set(cursorSmall, { x: smallPos.x, y: smallPos.y });
        gsap.set(cursorBig, { x: bigPos.x, y: bigPos.y });
    });

    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.querySelector('.cursor').classList.add('hovered');
            const rect = el.getBoundingClientRect();

            el.addEventListener('mousemove', (e) => {
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
            });
        });

        el.addEventListener('mouseleave', () => {
            document.querySelector('.cursor').classList.remove('hovered');
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
    });
}

/* ============================================
   3. KINETIC TYPOGRAPHY
   ============================================ */
function initKineticText() {
    const textElements = document.querySelectorAll('.kinetic-text');
    textElements.forEach(el => {
        const split = new SplitType(el, { types: 'chars' });
        gsap.set(split.chars, { y: 100, opacity: 0, rotateX: -90 });
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(split.chars, {
                    y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.02, ease: 'back.out(1.7)'
                });
            }
        });
    });
}

/* ============================================
   4. AGE GATE
   ============================================ */
function initAgeGate() {
    const ageGate = document.getElementById('age-gate');
    const yesBtn = document.getElementById('age-yes');
    const noBtn = document.getElementById('age-no');

    if (!ageGate) return;
    if (sessionStorage.getItem('age-verified') === 'true') {
        ageGate.classList.add('hidden');
        return;
    }

    document.body.style.overflow = 'hidden';
    if(lenis) lenis.stop();

    yesBtn.addEventListener('click', () => {
        try { sessionStorage.setItem('age-verified', 'true'); } catch (e) {}
        ageGate.classList.add('hidden');
        document.body.style.overflow = '';
        if(lenis) lenis.start();
        setTimeout(() => { ScrollTrigger.refresh(); }, 500);
    });

    noBtn.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });
}

/* ============================================
   5. NAV PILL
   ============================================ */
function initNavPill() {
    const navPill = document.getElementById('nav-pill');
    const menuBtn = document.getElementById('nav-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (!navPill) return;

    ScrollTrigger.create({
        trigger: '.hero-bloom', start: 'top top', end: '30% top',
        onLeave: () => navPill.classList.add('visible'),
        onEnterBack: () => navPill.classList.remove('visible')
    });

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            if (mobileNav.classList.contains('active')) { if(lenis) lenis.stop(); } else { if(lenis) lenis.start(); }
        });
        const backdrop = mobileNav.querySelector('.mobile-nav__backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                if(lenis) lenis.start();
            });
        }
        const links = mobileNav.querySelectorAll('.mobile-nav__link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                if(lenis) lenis.start();
            });
        });
    }
}

/* ============================================
   6. HERO BLOOM
   ============================================ */
function initHeroBloom() {
    const section = document.querySelector('.hero-bloom');
    const heroContent = document.querySelector('.hero-bloom__hero-content');
    const featuredPen = document.querySelector('.hero-bloom__featured-pen');
    const bloomTitle = document.querySelector('.hero-bloom__bloom-title');
    const pens = gsap.utils.toArray('.hero-bloom__pen');
    const labels = gsap.utils.toArray('.hero-bloom__label');

    if (!section || !pens.length) return;

    function waitForPenImages() {
        const imgs = pens.map(p => p.querySelector('img'));
        const promises = imgs.map(img => {
            return new Promise((resolve) => {
                if (!img) return resolve();
                if (img.complete && img.naturalWidth) return resolve();
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
            });
        });
        return Promise.all(promises).then(() => imgs);
    }

    waitForPenImages().then((imgs) => {
        const heights = imgs.map(img => img ? img.getBoundingClientRect().height : 0);
        const maxH = Math.max(...heights, 0);

        pens.forEach((pen) => {
            pen.style.height = maxH + 'px';
            pen.style.display = 'flex';
            pen.style.flexDirection = 'column';
            pen.style.justifyContent = 'flex-end';
            pen.style.alignItems = 'center';
            const img = pen.querySelector('img');
            if (img) { img.style.display = 'block'; img.style.maxHeight = '100%'; img.style.width = 'auto'; }
        });

        function getBloomPositions() {
            const vw = window.innerWidth;
            const penCount = pens.length || 6;
            const isMobile = window.innerWidth < 900;
            const totalSpread = isMobile ? vw * 0.85 : vw * 0.65;
            const startX = -totalSpread / 2;
            const gap = totalSpread / (penCount - 1);
            const positions = [];
            for (let i = 0; i < penCount; i++) {
                const x = startX + (i * gap);
                const y = isMobile ? -10 : -20;
                const middleIndex = (penCount - 1) / 2;
                const rotation = (i - middleIndex) * (isMobile ? 3 : 5);
                positions.push({ x, y, rotation });
            }
            return positions;
        }

        let bloomPositions = getBloomPositions();
        pens.forEach(pen => {
            gsap.set(pen, { opacity: 0, scale: 0.7, x: 0, y: 0, xPercent: -50, yPercent: -50, rotation: 0 });
        });
        gsap.set(labels, { opacity: 0, y: 20 });
        gsap.set(bloomTitle, { opacity: 0, y: 30 });

        const masterTl = gsap.timeline({
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 }
        });

        masterTl.to(heroContent, { opacity: 0, x: window.innerWidth < 900 ? 0 : -80, duration: 0.12, ease: 'power2.in' }, 0.20);
        masterTl.to(featuredPen, { x: () => {
                const rect = featuredPen.getBoundingClientRect();
                const centerX = window.innerWidth / 2;
                const penCenterX = rect.left + rect.width / 2;
                return centerX - penCenterX;
            }, y: 0, scale: 1.1, duration: 0.15, ease: 'power2.inOut' }, 0.20);
        masterTl.to(featuredPen, { opacity: 0, scale: 0.8, duration: 0.08, ease: 'power2.in' }, 0.32);
        masterTl.to(bloomTitle, { opacity: 1, y: 0, duration: 0.10, ease: 'power3.out' }, 0.35);
        pens.forEach((pen, i) => { masterTl.to(pen, { opacity: 1, scale: 1, duration: 0.06, ease: 'power2.out' }, 0.40 + (i * 0.015)); });
        pens.forEach((pen, i) => {
            const pos = bloomPositions[i];
            masterTl.to(pen, { x: pos.x, y: pos.y, rotation: pos.rotation, duration: 0.22, ease: 'back.out(1.2)' }, 0.50 + (i * 0.02));
        });
        labels.forEach((label, i) => { masterTl.to(label, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.68 + (i * 0.015)); });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newHeights = imgs.map(img => img ? img.getBoundingClientRect().height : 0);
                const newMax = Math.max(...newHeights, 0);
                pens.forEach((pen) => { pen.style.height = newMax + 'px'; });
                bloomPositions = getBloomPositions();
                ScrollTrigger.refresh();
            }, 250);
        });
        setTimeout(() => ScrollTrigger.refresh(), 60);
    });
}

/* ============================================
   7. PHILOSOPHY VIDEO
   ============================================ */
function initPhilosophyVideo() {
    const video = document.getElementById('philosophy-video');
    const section = document.querySelector('.philosophy');
    if (!video || !section) return;

    video.muted = true; video.playsInline = true; video.preload = 'auto';
    let isReady = false; let duration = 0; let lastUpdateTime = 0; const updateThrottle = 50;

    function onVideoReady() {
        if (video.duration && video.duration > 0 && video.duration !== Infinity) {
            isReady = true; duration = video.duration; video.currentTime = 0;
        }
    }
    video.addEventListener('loadedmetadata', onVideoReady);
    video.addEventListener('canplay', onVideoReady);
    video.load();

    ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.3,
        onUpdate: (self) => {
            if (!isReady || !duration) return;
            const now = Date.now();
            if (now - lastUpdateTime < updateThrottle) return;
            lastUpdateTime = now;
            const videoStart = 0.4; const videoEnd = 0.95;
            try {
                let targetTime;
                if (self.progress < videoStart) { targetTime = 0; }
                else if (self.progress > videoEnd) { targetTime = duration - 0.01; }
                else { const videoProgress = (self.progress - videoStart) / (videoEnd - videoStart); targetTime = videoProgress * duration; }
                if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.05) { video.currentTime = targetTime; }
            } catch (e) {}
        }
    });
}

/* ============================================
   8. COLLECTION
   ============================================ */
function initCollection() {
    const section = document.querySelector('.collection');
    const pens = gsap.utils.toArray('.collection__pen');
    const dots = gsap.utils.toArray('.collection__dot');
    const nameEl = document.querySelector('.collection__name');
    const taglineEl = document.querySelector('.collection__tagline');
    const descEl = document.querySelector('.collection__desc');
    const counterEl = document.querySelector('.collection__counter');

    if (!section || !pens.length) return;

    const products = [
        { name: 'Azure', tagline: 'Cool Serenity', desc: 'Our signature blend crafted for moments of clarity. Azure delivers a smooth, refined experience with subtle terpene notes.' },
        { name: 'Apple Green', tagline: 'Crisp Vitality', desc: 'Bright and invigorating. Apple Green brings a fresh perspective to your day with uplifting citrus notes.' },
        { name: 'Champagne Gold', tagline: 'Luxe Elevation', desc: 'The crown jewel. Champagne Gold offers a premium experience with rich, sophisticated undertones.' },
        { name: 'Sakura Pink', tagline: 'Gentle Bloom', desc: 'Soft and balanced. Sakura Pink provides a delicate touch perfect for unwinding.' },
        { name: 'Silver', tagline: 'Pure Clarity', desc: 'Clean and precise. Silver delivers an unmistakably smooth draw for the purist.' },
        { name: 'Obsidian', tagline: 'Deep Intensity', desc: 'Bold and robust. Obsidian brings depth and complexity for the experienced connoisseur.' }
    ];

    let currentIndex = 0; let isAnimating = false;

    function transitionTo(index) {
        if (index === currentIndex || isAnimating) return;
        isAnimating = true;
        const oldPen = pens[currentIndex];
        const newPen = pens[index];
        const product = products[index];

        gsap.to(oldPen, { opacity: 0, y: -30, duration: 0.3, ease: 'power2.in', onComplete: () => { oldPen.classList.remove('active'); } });
        gsap.to([nameEl, taglineEl, descEl], {
            opacity: 0, y: -10, duration: 0.2, stagger: 0.05,
            onComplete: () => {
                nameEl.textContent = product.name; taglineEl.textContent = product.tagline; descEl.textContent = product.desc; counterEl.textContent = `${index + 1} / ${products.length}`;
                gsap.to([nameEl, taglineEl, descEl], { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 });
            }
        });
        gsap.fromTo(newPen, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: 'power2.out',
            onStart: () => { newPen.classList.add('active'); },
            onComplete: () => { isAnimating = false; }
        });
        dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); });
        currentIndex = index;
    }

    ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.5,
        onUpdate: (self) => {
            const newIndex = Math.min(Math.floor(self.progress * products.length), products.length - 1);
            if (newIndex !== currentIndex) { transitionTo(newIndex); }
        }
    });
}

/* ============================================
   9. GUMMIES 3D EXPLOSION
   ============================================ */
async function initGummies() {
    const canvas = document.getElementById('gummies-canvas');
    const section = document.querySelector('.gummies');
    if (!canvas || !section) return;

    let THREE, GLTFLoader, SkeletonUtils;
    try {
        THREE = await import('three');
        const gltfModule = await import('three/addons/loaders/GLTFLoader.js');
        const skeletonModule = await import('three/addons/utils/SkeletonUtils.js');
        GLTFLoader = gltfModule.GLTFLoader;
        SkeletonUtils = skeletonModule.SkeletonUtils;
    } catch (e) { console.error('Failed to load Three.js:', e); return; }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F1EB);
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.9);
    directional.position.set(5, 10, 7);
    scene.add(directional);

    const colors = [0xE74C3C, 0xF39C12, 0xF1C40F, 0x2ECC71, 0x9B59B6, 0xE91E63, 0x3498DB, 0x1ABC9C];
    const gummies = [];
    const gummyCount = 45;

    function setupGummy(mesh, index, baseScale = 1) {
        const randScale = (0.6 + Math.random() * 0.5) * baseScale;
        mesh.userData.baseScale = randScale;
        mesh.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
        mesh.userData.startPos = mesh.position.clone();
        mesh.userData.targetPos = new THREE.Vector3((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 15 - 8);
        mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        mesh.userData.rotSpeed = { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.01 };
        mesh.scale.set(0, 0, 0);
    }

    function createFallbackGummies() {
        for (let i = 0; i < gummyCount; i++) {
            const geometry = new THREE.SphereGeometry(0.7, 16, 16);
            const material = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.3, metalness: 0.2 });
            const mesh = new THREE.Mesh(geometry, material);
            setupGummy(mesh, i, 1);
            scene.add(mesh);
            gummies.push(mesh);
        }
    }

    const loader = new GLTFLoader();
    loader.load('images/gummies.glb', (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(1.4 / maxDim);

        for (let i = 0; i < gummyCount; i++) {
            const gummy = SkeletonUtils.clone(model);
            gummy.traverse((child) => {
                if (child.isMesh) {
                    if (!child.material.map) {
                        child.material = child.material.clone();
                        child.material.color = new THREE.Color(colors[i % colors.length]);
                    }
                }
            });
            setupGummy(gummy, i, model.scale.x);
            scene.add(gummy);
            gummies.push(gummy);
        }
    }, undefined, () => createFallbackGummies());

    let explosionProgress = 0;
    ScrollTrigger.create({
        trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.5,
        onUpdate: (self) => { explosionProgress = self.progress; }
    });

    function animate() {
        requestAnimationFrame(animate);
        if (gummies.length === 0) return;
        gummies.forEach((gummy) => {
            const scaleProgress = Math.min(explosionProgress * 2.5, 1);
            const s = gsap.parseEase('power2.out')(scaleProgress) * (gummy.userData.baseScale || 1);
            gummy.scale.set(s, s, s);
            const moveProgress = Math.max((explosionProgress - 0.15) * 1.3, 0);
            const easedMove = gsap.parseEase('power2.out')(Math.min(moveProgress, 1));
            gummy.position.lerpVectors(gummy.userData.startPos, gummy.userData.targetPos, easedMove);
            gummy.rotation.x += gummy.userData.rotSpeed.x;
            gummy.rotation.y += gummy.userData.rotSpeed.y;
            gummy.rotation.z += gummy.userData.rotSpeed.z;
        });
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    });
}

/* ============================================
   10. FAQ
   ============================================ */
function initFAQ() {
    const items = document.querySelectorAll('.faq__item');
    items.forEach(item => {
        const question = item.querySelector('.faq__question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(other => other.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Phase 2 SOTY Initialization (Textures & Liquids)...');

    initSmoothScroll();
    initCursor();
    initHeroParallax(); // Phase 2 Parallax

    initAgeGate();
    initNavPill();
    initHeroBloom();
    initPhilosophyVideo();
    initCollection();
    initGummies();
    initFAQ();

    window.addEventListener('load', () => {
        setTimeout(() => {
            initKineticText();
            ScrollTrigger.refresh();
        }, 100);
    });
});