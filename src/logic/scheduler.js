import { isBefore, startOfDay } from 'date-fns';

export function getDueCards(cards) {
  const today = startOfDay(new Date());
  return cards
    .filter((card) => {
      const nextDate = new Date(card.nextReviewDate);
      return isBefore(nextDate, today) || nextDate.getTime() === today.getTime();
    })
    .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));
}

export function getDueCount(cards) {
  return getDueCards(cards).length;
}

export function getMasteredCards(cards) {
  return cards.filter((c) => c.interval >= 21);
}
