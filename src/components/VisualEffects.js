import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';

function VisualEffects() {
  const ref = useRef(null);

  useEffect(() => {
    const container = document.getElementById('visual-root') || document.body;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    camera.position.z = 180;

    // fullscreen audio-reactive shader plane
    const planeGeo = new THREE.PlaneGeometry(2, 2);

    // audio texture placeholder (will be updated each frame if analyser exists)
    const audioSize = 1024;
    const audioData = new Uint8Array(audioSize);
    const audioTexture = new THREE.DataTexture(audioData, audioSize, 1, THREE.LuminanceFormat);
    audioTexture.needsUpdate = true;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAudio: { value: audioTexture },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform sampler2D uAudio;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // simple palette
        vec3 palette(float t) {
          return vec3(0.5 + 0.5*cos(6.28318*(t+vec3(0.0,0.33,0.66))));
        }

        void main() {
          float x = vUv.x;
          // sample audio texture across frequency axis
          float audioIndex = texture2D(uAudio, vec2(x, 0.0)).r;
          float bass = texture2D(uAudio, vec2(0.05, 0.0)).r;
          float mid = texture2D(uAudio, vec2(0.25, 0.0)).r;
          float hi = texture2D(uAudio, vec2(0.75, 0.0)).r;

          float t = uTime * 0.1;
          float wave = sin((vUv.x + t * 0.5) * 10.0 + audioIndex * 10.0) * 0.5 + 0.5;
          float glow = pow(max(0.0, 1.0 - distance(vUv, vec2(0.5, 0.5)) * (1.0 - bass)), 2.0);

          vec3 col = palette(wave + mid * 0.5 + hi * 0.2);
          col += vec3(0.2, 0.12, 0.05) * glow * (0.5 + bass);
          col *= 0.6 + audioIndex * 1.2;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true
    });

    const shaderPlane = new THREE.Mesh(planeGeo, shaderMaterial);
    shaderPlane.frustumCulled = false;
    scene.add(shaderPlane);

    // reactive particle field
    const particleCount = 1024;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      const c = new THREE.Color().setHSL(Math.random(), 0.7, 0.5);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({ size: 6, vertexColors: true, transparent: true, opacity: 0.9 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // postprocessing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.8, 0.1);
    bloom.threshold = 0.0;
    bloom.strength = 0.9;
    bloom.radius = 0.6;
    composer.addPass(bloom);
    const rgbPass = new ShaderPass(RGBShiftShader);
    rgbPass.uniforms['amount'].value = 0.0015;
    composer.addPass(rgbPass);

    const analyser = window.__audioAnalyser || null;
    let dataArray = null;
    if (analyser) {
      const bufferLength = Math.min(analyser.frequencyBinCount, audioSize);
      dataArray = new Uint8Array(bufferLength);
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      requestAnimationFrame(animate);

      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        // fill audioData texture (normalize to 0..1)
        for (let i = 0; i < dataArray.length; i++) {
          audioData[i] = dataArray[i];
        }
        audioTexture.needsUpdate = true;

        // use low-frequency energy to pulse particles
        let lowSum = 0;
        for (let i = 0; i < 64 && i < dataArray.length; i++) lowSum += dataArray[i];
        const lowAvg = (lowSum / Math.min(64, dataArray.length)) / 255;

        const pos = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3 + 2;
          pos[idx] += Math.sin(i + now * 0.001) * 0.2 * (0.5 + lowAvg * 8);
        }
        particleGeo.attributes.position.needsUpdate = true;

        // color shift based on mids
        let midSum = 0; let midCount = 0;
        for (let i = 64; i < 512 && i < dataArray.length; i++) { midSum += dataArray[i]; midCount++; }
        const midAvg = midCount ? (midSum / midCount) / 255 : 0;
        particleMat.size = 4 + midAvg * 20;
        rgbPass.uniforms['amount'].value = 0.001 + midAvg * 0.02;
        bloom.strength = 0.6 + lowAvg * 2.0;
      }

      shaderMaterial.uniforms.uTime.value += dt;

      composer.render(dt);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      try { container.removeChild(renderer.domElement); } catch (e) {}
      composer.dispose();
      planeGeo.dispose();
      shaderMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return <div ref={ref} />;
}

export default VisualEffects;
