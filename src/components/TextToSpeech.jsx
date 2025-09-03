import React, { useState, useEffect } from 'react';
import { useSpeech } from 'react-text-to-speech';

function HomePage() {
  const textToRead = "Welcome to our website! Please click the 'Start Reading' button to begin. This text will be read after your interaction.";
  const { speechStatus, start, pause, stop } = useSpeech({ text: textToRead });

  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // This useEffect will now only attempt to play if hasUserInteracted is true
  useEffect(() => {
    if (hasUserInteracted && speechStatus === 'stopped') { // Only start if user has interacted and speech is not already playing
      start();
    }
  }, [hasUserInteracted, speechStatus, start]); // Include 'start' in dependencies for stability

  const handleStartClick = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true); // Mark that user has interacted
    }
    // Regardless of initial auto-play, this button always explicitly starts
    start();
  };

  return (
    <div>
      <h1>Welcome Page</h1>
      <p>{textToRead}</p>

      <div>
        {/* The user must click this button at least once to enable speech */}
        <button onClick={handleStartClick} disabled={speechStatus === 'playing'}>
          Start Reading
        </button>
        <button onClick={pause} disabled={speechStatus !== 'playing'}>
          Pause
        </button>
        <button onClick={stop} disabled={speechStatus === 'stopped'}>
          Stop Reading
        </button>
        <p>Speech Status: {speechStatus}</p>
        {!hasUserInteracted && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            (Browsers require a user interaction to play audio. Please click "Start Reading".)
          </p>
        )}
      </div>
    </div>
  );
}

export default HomePage;