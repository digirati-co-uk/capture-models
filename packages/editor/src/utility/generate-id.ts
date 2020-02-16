import nanoId from 'nanoid/non-secure';

export function generateId(size = 12) {
  return nanoId(size);
}
