import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import VisualEffects from './components/VisualEffects';
import AudioEffects from './components/AudioEffects';

function App() {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <Footer />
      <VisualEffects />
      <AudioEffects />
    </div>
  );
}

export default App;
