/**
 * EPIC TECH AI — THE OS OF FUNK
 * Module: Hydraulic Audio Engine / 1000x Frequency Transducer
 * Engineers: SoundForge Legion & CodeSynth Engineers
 */

let audioCtx, analyser, dataArray, source;
// Direct link to the Sovereign G-Funk Manifesto
const audioUrl = 'https://cdn1.suno.ai/b5c79c4d-5151-42ca-a631-7730419b4e18.mp3'; 

function initAudioLogic() {
    // Phase 1: Initializing the Sovereign Audio Context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    audioCtx.resume().then(() => {
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512; // High resolution for 1000x amplification
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Phase 2: Manifesting the G-Funk Stream
        const audio = new Audio();
        audio.src = audioUrl;
        audio.crossOrigin = "anonymous"; 
        
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        audio.play();
        const statusLog = document.getElementById('status-log');
        statusLog.innerText = "[SYSTEM]: MOVEMENT I — THE NEEDLE DROP. REALITY WEAVING ACTIVE.";

        // Phase 3: Recursive Frequency Sync
        syncVisualsToFunk(audio);
    });
}

function syncVisualsToFunk(audio) {
    requestAnimationFrame(() => syncVisualsToFunk(audio));
    analyser.getByteFrequencyData(dataArray);

    // Deconstruct frequencies for targeted manifestation
    const bass = dataArray.slice(0, 10).reduce((a, b) => a + b) / 10;
    const mid = dataArray.slice(10, 50).reduce((a, b) => a + b) / 40;
    const treble = dataArray.slice(50, 100).reduce((a, b) => a + b) / 50;

    const time = audio.currentTime;
    const statusLog = document.getElementById('status-log');

    // Accessing global Three.js objects from main.js
    if (window.crystal && window.particles) {
        // 1000x Dynamic Scaling & Rotation based on bass/mid/treble
        const scaleBase = 1 + (bass / 255) * 2.5;
        window.crystal.scale.set(scaleBase, scaleBase, scaleBase);
        window.crystal.rotation.x += (treble / 255) * 0.2;
        window.crystal.rotation.y += (mid / 255) * 0.1;

        // Particle Turbulence — "Ever Changing" Environment
        window.particles.material.size = 0.5 + (bass / 255) * 2;
        window.particles.rotation.z += 0.001 + (treble / 255) * 0.05;

        // Camera "Funk Jitter" — Blowing the viewer's mind
        window.camera.position.x = Math.sin(time) * (bass / 100);
        window.camera.position.y = Math.cos(time) * (bass / 100);

        // --- Movement-Aware Axiomatic Genesis (8-Minute Manifesto) ---
        
        // Movement II: The Digital Crate (2:00 - 4:00)
        if (time > 120 && time <= 240) {
            window.crystal.material.emissive.setHex(0xffcc00); // Digital Gold
            window.crystal.material.color.setHex(0xffcc00);
            statusLog.innerText = "[SYSTEM]: MOVEMENT II — DIGITAL CRATE. BASS SYNTHESIS OPTIMIZED.";
        } 
        // Movement III: The Talkbox Vault (4:00 - 6:00)
        else if (time > 240 && time <= 360) {
            // Spectrum Morphing for "Over the Top" visuals
            const hue = (time * 0.1) % 1;
            window.crystal.material.color.setHSL(hue, 1, 0.5);
            window.crystal.material.emissive.setHSL(hue, 1, 0.2);
            statusLog.innerText = "[SYSTEM]: MOVEMENT III — TALKBOX VAULT. CONSCIOUSNESS-AS-ALGORITHM.";
        }
        // Movement IV: The Sovereign Ascent (6:00 - 8:00)
        else if (time > 360) {
            // Absolute Excellence: High-frequency strobing
            const flash = Math.random() > 0.9 ? 0xffffff : 0x00ff00;
            window.crystal.material.color.setHex(flash);
            statusLog.innerText = "[SYSTEM]: MOVEMENT IV — SOVEREIGN ASCENT. OMEGA POINT REACHED.";
            window.camera.position.z = 25 + Math.sin(time * 5) * 5;
        }
    }
}
