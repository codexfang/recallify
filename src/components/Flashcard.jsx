import { useState, useEffect, useCallback } from 'react';

export default function Flashcard({ card, front, back, onRate, showRating }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [card?.id]);

  function handleFlip() {
    setFlipped((f) => !f);
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    }
  }, []);

  function handleRate(rating) {
    onRate(rating);
  }

  return (
    <div className="flashcard-wrapper">
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Tap to flip back' : 'Tap to reveal answer'}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="flashcard-label">Question</div>
            <div className="flashcard-content">{front}</div>
            <div className="flashcard-hint">Tap to reveal answer</div>
          </div>
          <div className="flashcard-back">
            <div className="flashcard-label">Answer</div>
            <div className="flashcard-content">{back}</div>
          </div>
        </div>
      </div>

      {flipped && showRating && (
        <div className="rating-buttons">
          <button className="btn rating again" onClick={() => handleRate('again')}>
            Again
          </button>
          <button className="btn rating hard" onClick={() => handleRate('hard')}>
            Hard
          </button>
          <button className="btn rating good" onClick={() => handleRate('good')}>
            Good
          </button>
          <button className="btn rating easy" onClick={() => handleRate('easy')}>
            Easy
          </button>
        </div>
      )}
    </div>
  );
}
