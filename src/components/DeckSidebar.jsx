import { useState } from 'react';
import useStore from '../store/useStore';
import { getDueCount } from '../logic/scheduler';
import { importDecks } from '../utils/storage';

export default function DeckSidebar({ view, onViewChange }) {
  const decks = useStore((s) => s.decks);
  const activeDeckId = useStore((s) => s.activeDeckId);
  const setActiveDeck = useStore((s) => s.setActiveDeck);
  const createDeck = useStore((s) => s.createDeck);
  const deleteDeck = useStore((s) => s.deleteDeck);
  const importDecksAction = useStore((s) => s.importDecks);

  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const renameDeck = useStore((s) => s.renameDeck);

  function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    createDeck(newName.trim());
    setNewName('');
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    importDecks(file)
      .then((data) => {
        if (Array.isArray(data)) {
          importDecksAction(data);
        }
      })
      .catch(console.error);
    e.target.value = '';
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Recallify</h2>
        <button className="icon-btn" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <form className="create-deck-form" onSubmit={handleCreate}>
        <input
          className="input"
          placeholder="New deck name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">+</button>
      </form>

      <div className="sidebar-nav">
        <button
          className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          Dashboard
        </button>
      </div>

      <div className="sidebar-decks">
        <div className="sidebar-label">Decks</div>
        {decks.length === 0 && <p className="empty-text">No decks yet</p>}
        {decks.map((deck) => (
          <div
            key={deck.id}
            className={`deck-item ${deck.id === activeDeckId ? 'active' : ''}`}
          >
            {renaming === deck.id ? (
              <form
                className="rename-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (renameValue.trim()) {
                    renameDeck(deck.id, renameValue.trim());
                  }
                  setRenaming(null);
                }}
              >
                <input
                  className="input input-sm"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  autoFocus
                  onBlur={() => setRenaming(null)}
                />
              </form>
            ) : (
              <button
                className="deck-link"
                onClick={() => {
                  setActiveDeck(deck.id);
                  onViewChange('deck');
                }}
              >
                <span className="deck-name">{deck.name}</span>
                <span className="deck-count">{getDueCount(deck.cards)}</span>
              </button>
            )}
            <div className="deck-actions">
              <button
                className="icon-btn-sm"
                title="Rename"
                onClick={() => {
                  setRenaming(deck.id);
                  setRenameValue(deck.name);
                }}
              >
                ✎
              </button>
              <button
                className="icon-btn-sm danger"
                title="Delete"
                onClick={() => {
                  if (confirm(`Delete "${deck.name}"?`)) deleteDeck(deck.id);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <label className="btn btn-outline import-btn">
          Import JSON
          <input type="file" accept=".json" onChange={handleImport} hidden />
        </label>
      </div>
    </aside>
  );
}
