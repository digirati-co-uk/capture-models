import { useContext } from 'react';
import { ContentContext } from '../context';

export function useContent() {
  const c = useContext(ContentContext);
  if (!c) throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
