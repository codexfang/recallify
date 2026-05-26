import { create } from 'zustand';
import { loadState, saveState } from '../utils/storage';
import { calculateSM2 } from '../logic/sm2Algorithm';

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function createCard(front, back) {
  return {
    id: generateId(),
    front,
    back,
    easinessFactor: 2.5,
    interval: 0,
    repetition: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewedAt: null,
    createdAt: new Date().toISOString(),
  };
}

function createDeck(name) {
  return {
    id: generateId(),
    name,
    cards: [],
    createdAt: new Date().toISOString(),
  };
}

const initialState = loadState() || {
  decks: [],
  activeDeckId: null,
  studyHistory: [],
};

const useStore = create((set, get) => ({
  ...initialState,

  persist() {
    const { decks, activeDeckId, studyHistory } = get();
    saveState({ decks, activeDeckId, studyHistory });
  },

  createDeck(name) {
    const deck = createDeck(name);
    set((s) => ({
      decks: [...s.decks, deck],
      activeDeckId: deck.id,
    }));
    get().persist();
  },

  renameDeck(id, name) {
    set((s) => ({
      decks: s.decks.map((d) => (d.id === id ? { ...d, name } : d)),
    }));
    get().persist();
  },

  deleteDeck(id) {
    set((s) => ({
      decks: s.decks.filter((d) => d.id !== id),
      activeDeckId: s.activeDeckId === id ? null : s.activeDeckId,
    }));
    get().persist();
  },

  setActiveDeck(id) {
    set({ activeDeckId: id });
    get().persist();
  },

  addCard(deckId, front, back) {
    set((s) => ({
      decks: s.decks.map((d) =>
        d.id === deckId ? { ...d, cards: [...d.cards, createCard(front, back)] } : d
      ),
    }));
    get().persist();
  },

  editCard(deckId, cardId, front, back) {
    set((s) => ({
      decks: s.decks.map((d) =>
        d.id === deckId
          ? {
              ...d,
              cards: d.cards.map((c) =>
                c.id === cardId ? { ...c, front, back } : c
              ),
            }
          : d
      ),
    }));
    get().persist();
  },

  deleteCard(deckId, cardId) {
    set((s) => ({
      decks: s.decks.map((d) =>
        d.id === deckId
          ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
          : d
      ),
    }));
    get().persist();
  },

  reviewCard(deckId, cardId, rating) {
    set((s) => ({
      decks: s.decks.map((d) =>
        d.id === deckId
          ? {
              ...d,
              cards: d.cards.map((c) =>
                c.id === cardId ? calculateSM2(c, rating) : c
              ),
            }
          : d
      ),
      studyHistory: [
        ...s.studyHistory,
        { cardId, deckId, rating, date: new Date().toISOString() },
      ],
    }));
    get().persist();
  },

  importDecks(decks) {
    set((s) => ({
      decks: [...s.decks, ...decks],
    }));
    get().persist();
  },

  clearData() {
    set({ decks: [], activeDeckId: null, studyHistory: [] });
    saveState({ decks: [], activeDeckId: null, studyHistory: [] });
  },
}));

export default useStore;
