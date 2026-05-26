export function getDueCards(cards) {
  const now = Date.now();
  return cards
    .filter((card) => new Date(card.nextReviewDate).getTime() <= now)
    .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));
}

export function getDueCount(cards) {
  return getDueCards(cards).length;
}

export function getMasteredCards(cards) {
  return cards.filter((c) => c.interval >= 21);
}
