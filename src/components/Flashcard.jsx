import { useState } from 'react';

export default function Flashcard({ card, front, back, onRate, showRating }) {
  const [flipped, setFlipped] = useState(false);

  function handleFlip() {
    if (!flipped) setFlipped(true);
  }

  function handleRate(rating) {
    setFlipped(false);
    onRate(rating);
  }

  return (
    <div className="flashcard-wrapper">
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="flashcard-label">Front</div>
            <div className="flashcard-content">{front}</div>
            {!flipped && <div className="flashcard-hint">Tap to reveal answer</div>}
          </div>
          <div className="flashcard-back">
            <div className="flashcard-label">Back</div>
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
