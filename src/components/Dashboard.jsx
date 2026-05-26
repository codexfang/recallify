import { useMemo } from 'react';
import useStore from '../store/useStore';
import { getDueCount, getMasteredCards } from '../logic/scheduler';
import { startOfDay, subDays, isSameDay } from 'date-fns';
import StatsChart from './StatsChart';
import { exportDecks } from '../utils/storage';

export default function Dashboard() {
  const decks = useStore((s) => s.decks);
  const studyHistory = useStore((s) => s.studyHistory);
  const clearData = useStore((s) => s.clearData);

  const totalCards = useMemo(
    () => decks.reduce((acc, d) => acc + d.cards.length, 0),
    [decks]
  );

  const dueCount = useMemo(
    () => decks.reduce((acc, d) => acc + getDueCount(d.cards), 0),
    [decks]
  );

  const masteredCount = useMemo(
    () => decks.reduce((acc, d) => acc + getMasteredCards(d.cards).length, 0),
    [decks]
  );

  const totalReviewed = studyHistory.length;

  const streak = useMemo(() => {
    let count = 0;
    const today = startOfDay(new Date());
    for (let i = 0; i < 365; i++) {
      const date = subDays(today, i);
      const hasReview = studyHistory.some((entry) =>
        isSameDay(startOfDay(new Date(entry.date)), date)
      );
      if (hasReview) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [studyHistory]);

  function handleExport() {
    exportDecks(decks);
  }

  function handleClear() {
    if (confirm('Delete all data? This cannot be undone.')) {
      clearData();
    }
  }

  return (
    <div className="main-content dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-actions">
          <button className="btn btn-outline" onClick={handleExport}>
            Export Decks
          </button>
          <button className="btn btn-outline danger" onClick={handleClear}>
            Clear Data
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCards}</div>
          <div className="stat-label">Total Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{dueCount}</div>
          <div className="stat-label">Due for Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{masteredCount}</div>
          <div className="stat-label">Mastered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalReviewed}</div>
          <div className="stat-label">Reviews Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <StatsChart />

      <div className="deck-progress-section">
        <h3>Deck Progress</h3>
        {decks.length === 0 && <p className="empty-text">No decks created yet.</p>}
        {decks.map((deck) => {
          const total = deck.cards.length;
          const mastered = getMasteredCards(deck.cards).length;
          const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
          return (
            <div key={deck.id} className="deck-progress-item">
              <div className="deck-progress-header">
                <span className="deck-progress-name">{deck.name}</span>
                <span className="deck-progress-pct">{pct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
