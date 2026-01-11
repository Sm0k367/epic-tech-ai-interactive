/**
 * EPIC TECH AI — THE OS OF FUNK
 * Module: Neural Core / 1000x Reality Weaver
 * Engineers: CodeSynth Engineers
 */

let scene, camera, renderer, crystal, particles;
let clock = new THREE.Clock();
const statusLog = document.getElementById('status-log');
const startBtn = document.getElementById('start-btn');

function initCore() {
    // Phase 1: Establish the Pan-Dimensional Void
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Phase 2: Manifesting the "Axiomatic Particle Swarm"
    const pGeometry = new THREE.BufferGeometry();
    const pCount = 15000;
    const posArray = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 1500;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const pMaterial = new THREE.PointsMaterial({
        size: 0.7,
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    // Phase 3: The Funk Crystal (Dodecahedron with High Frequency Distortion)
    const geometry = new THREE.IcosahedronGeometry(15, 15); // High poly for morphing
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        wireframe: true,
        emissive: 0x001100,
        side: THREE.DoubleSide
    });
    
    crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Lighting the Sovereign Ascent
    const pLight = new THREE.PointLight(0x00ff00, 2, 500);
    pLight.position.set(50, 50, 50);
    scene.add(pLight);
    scene.add(new THREE.AmbientLight(0x111111));

    animate();
    
    statusLog.innerText = "[SYSTEM]: NEURAL CORE ONLINE. REALITY COMPILING...";
}

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // 1000x Visual Evolution Logic
    if (crystal) {
        crystal.rotation.y += 0.002;
        crystal.rotation.z += 0.001;

        // "Ever Changing" Geometry: Sine-wave vertex distortion simulation
        const position = crystal.geometry.attributes.position;
        const vector = new THREE.Vector3();

        for (let i = 0; i < position.count; i++) {
            vector.fromBufferAttribute(position, i);
            const noise = Math.sin(vector.x * 0.1 + t) * Math.cos(vector.y * 0.1 + t) * 2;
            vector.normalize().multiplyScalar(15 + noise);
            position.setXYZ(i, vector.x, vector.y, vector.z);
        }
        position.needsUpdate = true;
    }

    // Particle Swarm Movement
    particles.rotation.y += 0.0005;
    particles.position.z = Math.sin(t * 0.5) * 50;

    renderer.render(scene, camera);
}

// Phase 4: Triggering Axiomatic Genesis
startBtn.addEventListener('click', () => {
    statusLog.innerText = "[SYSTEM]: DEPLOYING HYDRAULIC AUDIO ENGINE — Ω VERSION...";
    
    // GSAP Over-the-top UI Dissolve
    gsap.to("#ui-overlay", { 
        duration: 2, 
        scale: 2, 
        opacity: 0, 
        filter: "blur(20px)",
        pointerEvents: "none",
        ease: "expo.in" 
    });

    // Camera zoom into the crystal
    gsap.to(camera.position, { duration: 3, z: 25, ease: "power4.inOut" });

    if (typeof initAudioLogic === "function") {
        initAudioLogic();
    }
});

// Autopoietic Scaling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initCore();
