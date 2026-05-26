import { useState, useEffect, useMemo, useCallback } from 'react';
import useStore from '../store/useStore';
import { getDueCards } from '../logic/scheduler';
import Flashcard from './Flashcard';

export default function ReviewSession({ deckId, onDone }) {
  const decks = useStore((s) => s.decks);
  const reviewCard = useStore((s) => s.reviewCard);

  const deck = decks.find((d) => d.id === deckId);

  const dueCards = useMemo(() => (deck ? getDueCards(deck.cards) : []), [deck]);

  const [remainingIds, setRemainingIds] = useState([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (deckId) {
      const due = deck ? getDueCards(deck.cards) : [];
      setRemainingIds(due.map((c) => c.id));
      setInitialTotal(due.length);
      setFinished(due.length === 0);
    }
  }, [deckId]);

  const currentCard = useMemo(() => {
    if (!deck || remainingIds.length === 0) return null;
    return deck.cards.find((c) => c.id === remainingIds[0]) || null;
  }, [deck, remainingIds]);

  const handleRate = useCallback(
    (rating) => {
      if (!currentCard) return;
      reviewCard(deckId, currentCard.id, rating);

      setRemainingIds((prev) => {
        const next = prev.slice(1);
        if (next.length === 0) {
          setFinished(true);
        }
        return next;
      });
    },
    [currentCard, deckId, reviewCard]
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
            Reviewed {initialTotal - remainingIds.length} of {initialTotal} cards
          </p>
          <button className="btn btn-primary" onClick={onDone} style={{ marginTop: 16 }}>
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content review-session">
      <div className="session-header">
        <div className="session-header-left">
          <button className="btn btn-outline btn-sm" onClick={onDone}>
            ← Back
          </button>
          <h2>{deck.name}</h2>
        </div>
        <span className="session-progress">
          {remainingIds.length} card{remainingIds.length !== 1 ? 's' : ''} remaining
        </span>
      </div>

      {currentCard ? (
        <Flashcard
          key={currentCard.id}
          card={currentCard}
          front={currentCard.front}
          back={currentCard.back}
          onRate={handleRate}
          showRating
        />
      ) : (
        <p className="empty-text">No cards to review.</p>
      )}
    </div>
  );
}
