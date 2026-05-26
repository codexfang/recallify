import { useState } from 'react';
import DeckSidebar from './components/DeckSidebar';
import ReviewSession from './components/ReviewSession';
import Dashboard from './components/Dashboard';
import useStore from './store/useStore';

export default function App() {
  const [view, setView] = useState('dashboard');
  const decks = useStore((s) => s.decks);
  const activeDeckId = useStore((s) => s.activeDeckId);
  const setActiveDeck = useStore((s) => s.setActiveDeck);
  const addCard = useStore((s) => s.addCard);
  const deleteCard = useStore((s) => s.deleteCard);

  const activeDeck = decks.find((d) => d.id === activeDeckId);

  const [showAddCard, setShowAddCard] = useState(false);
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');

  function handleAddCard(e) {
    e.preventDefault();
    if (!cardFront.trim() || !cardBack.trim() || !activeDeckId) return;
    addCard(activeDeckId, cardFront.trim(), cardBack.trim());
    setCardFront('');
    setCardBack('');
    setShowAddCard(false);
  }

  return (
    <div className="app-layout">
      <DeckSidebar view={view} onViewChange={setView} />

      <div className="main-area">
        {view === 'dashboard' && <Dashboard />}

        {view === 'review' && <ReviewSession deckId={activeDeckId} />}

        {view === 'review' && activeDeck && (
          <div className="deck-toolbar">
            <button
              className="btn btn-outline"
              onClick={() => setShowAddCard(!showAddCard)}
            >
              {showAddCard ? 'Cancel' : '+ Add Card'}
            </button>
          </div>
        )}

        {showAddCard && activeDeck && (
          <div className="add-card-panel">
            <form onSubmit={handleAddCard} className="add-card-form">
              <input
                className="input"
                placeholder="Front (question)"
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
              />
              <input
                className="input"
                placeholder="Back (answer)"
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Add Card
              </button>
            </form>
          </div>
        )}

        {view === 'review' && activeDeck && (
          <div className="card-list">
            <h3>Cards ({activeDeck.cards.length})</h3>
            {activeDeck.cards.length === 0 && (
              <p className="empty-text">No cards yet. Add one above!</p>
            )}
            {activeDeck.cards.map((card) => (
              <div key={card.id} className="card-list-item">
                <div className="card-list-text">
                  <strong>{card.front}</strong>
                  <span className="card-list-back">{card.back}</span>
                </div>
                <button
                  className="icon-btn-sm danger"
                  onClick={() => {
                    if (confirm('Delete this card?')) deleteCard(activeDeckId, card.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
