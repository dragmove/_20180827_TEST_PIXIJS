export const isDefined = obj => {
    if (obj === null || typeof obj === 'undefined') return false;

    return true;
};
