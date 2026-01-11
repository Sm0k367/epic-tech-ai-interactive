import React, { useEffect, useState, useRef } from 'react';

function AudioEffects() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const audioElRef = useRef(null);

  useEffect(() => {
    // create audio element and AudioContext + analyser
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new (AudioContext || window.AudioContext)();

    const audioElement = document.createElement('audio');
    audioElement.src = '/assets/sounds/background-music.mp3';
    audioElement.crossOrigin = 'anonymous';
    audioElement.loop = true;
    audioElement.preload = 'auto';

    const track = audioContext.createMediaElementSource(audioElement);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;

    track.connect(gainNode).connect(analyser).connect(audioContext.destination);

    // expose for visualizer
    window.__audioAnalyser = analyser;

    audioElRef.current = { audioContext, audioElement, gainNode, analyser };

    // mount controls container if not present
    const root = document.getElementById('audio-controls-root') || document.body;
    // create a hidden element to keep the audio element in DOM so browsers allow autoplay after user gesture
    audioElement.style.display = 'none';
    root.appendChild(audioElement);

    const startOnInteraction = () => {
      audioContext.resume();
      if (playing) audioElement.play().catch(() => {});
      window.removeEventListener('click', startOnInteraction);
    };
    window.addEventListener('click', startOnInteraction);

    return () => {
      window.removeEventListener('click', startOnInteraction);
      try {
        audioElement.pause();
        root.removeChild(audioElement);
      } catch (e) {}
      if (window.__audioAnalyser === analyser) delete window.__audioAnalyser;
    };
  }, []);

  useEffect(() => {
    if (audioElRef.current && audioElRef.current.gainNode) {
      audioElRef.current.gainNode.gain.value = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    const ref = audioElRef.current;
    if (!ref) return;
    try {
      if (playing) {
        ref.audioElement.pause();
        setPlaying(false);
      } else {
        await ref.audioContext.resume();
        await ref.audioElement.play();
        setPlaying(true);
      }
    } catch (e) {
      console.warn('Playback error', e);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const ref = audioElRef.current;
    if (ref) {
      ref.audioElement.src = url;
      ref.audioElement.play();
      setPlaying(true);
    }
  };

  return (
    <div id="audio-controls" style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 100, background: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8 }}>
      <button onClick={togglePlay} style={{ marginRight: 8 }}>{playing ? 'Pause' : 'Play'}</button>
      <label style={{ marginRight: 8 }}>Vol
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
      </label>
      <label style={{ marginLeft: 8 }}>
        Load
        <input type="file" accept="audio/*" onChange={onFileChange} style={{ display: 'inline-block', marginLeft: 6 }} />
      </label>
    </div>
  );
}

export default AudioEffects;
