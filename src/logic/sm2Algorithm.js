const MIN_EF = 1.3;
const INITIAL_EF = 2.5;

const RATING_MAP = {
  again: 0,
  hard: 2,
  good: 3,
  easy: 5,
};

export function calculateSM2(card, rating) {
  const q = RATING_MAP[rating];
  if (q === undefined) return card;

  let { easinessFactor, interval, repetition, nextReviewDate } = card;

  let newEF = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEF < MIN_EF) newEF = MIN_EF;

  let newInterval;
  let newRepetition;

  if (q < 3) {
    newRepetition = 0;
    newInterval = 0;
  } else {
    newRepetition = repetition + 1;
    if (newRepetition === 1) {
      newInterval = 1;
    } else if (newRepetition === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }

  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + newInterval);
  if (newInterval === 0) {
    nextDate.setMinutes(nextDate.getMinutes() + 10);
  }

  return {
    ...card,
    easinessFactor: newEF,
    interval: newInterval,
    repetition: newRepetition,
    nextReviewDate: nextDate.toISOString(),
    lastReviewedAt: now.toISOString(),
  };
}
