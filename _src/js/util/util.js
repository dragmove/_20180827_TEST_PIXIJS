import aid from 'aid.js';

export const isDef = aid.isDefined;
export const not = aid.not;

export const isDefined = obj => {
  if (obj === null || typeof obj === 'undefined') return false;

  return true;
};
