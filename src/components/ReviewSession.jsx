import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';
import { getDueCards } from '../logic/scheduler';
import Flashcard from './Flashcard';

export default function ReviewSession({ deckId }) {
  const decks = useStore((s) => s.decks);
  const reviewCard = useStore((s) => s.reviewCard);

  const deck = decks.find((d) => d.id === deckId);
  const [dueCards, setDueCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [sessionCards, setSessionCards] = useState([]);

  useEffect(() => {
    if (deck) {
      const due = getDueCards(deck.cards);
      setDueCards(due);
      setSessionCards([...due]);
      setIndex(0);
      setFinished(due.length === 0);
    }
  }, [deck]);

  const currentCard = sessionCards[index];

  const handleRate = useCallback(
    (rating) => {
      if (!currentCard) return;
      reviewCard(deckId, currentCard.id, rating);

      const remaining = sessionCards.filter((c) => c.id !== currentCard.id);
      if (remaining.length === 0) {
        setFinished(true);
        setSessionCards([]);
      } else {
        setSessionCards(remaining);
        setIndex(0);
      }
    },
    [currentCard, deckId, reviewCard, sessionCards]
  );

  if (!deck) {
    return (
      <div className="main-content center">
        <p>Select a deck to start reviewing.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="main-content center">
        <div className="session-done">
          <h2>Session Complete</h2>
          <p>All due cards reviewed. Great work!</p>
          <p className="session-stats">
            Reviewed {dueCards.length - sessionCards.length} of {dueCards.length} cards
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content review-session">
      <div className="session-header">
        <h2>{deck.name}</h2>
        <span className="session-progress">
          {sessionCards.length} card{sessionCards.length !== 1 ? 's' : ''} remaining
        </span>
      </div>

      <Flashcard
        key={currentCard?.id}
        card={currentCard}
        front={currentCard?.front}
        back={currentCard?.back}
        onRate={handleRate}
        showRating
      />
    </div>
  );
}
