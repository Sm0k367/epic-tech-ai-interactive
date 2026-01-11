import React, { useEffect } from 'react';

function AudioEffects() {
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = document.createElement('audio');
    audioElement.src = '/assets/sounds/background-music.mp3';
    audioElement.loop = true;
    audioElement.autoplay = true;

    const track = audioContext.createMediaElementSource(audioElement);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5;

    track.connect(gainNode).connect(audioContext.destination);

    document.body.appendChild(audioElement);

    return () => {
      audioElement.pause();
      document.body.removeChild(audioElement);
    };
  }, []);

  return null;
}

export default AudioEffects;
