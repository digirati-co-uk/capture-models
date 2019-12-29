import { useMemo, useState } from 'react';

export function useMiniRouter<T extends string>(routes: T[], defaultRoute: T) {
  const [current, setCurrent] = useState(defaultRoute);
  const router = useMemo(() => {
    return routes.reduce((acc, next: T) => {
      acc[next] = () => setCurrent(next);
      return acc;
    }, {} as any) as { [key in T]: () => void };
  }, routes);

  return [current, router, setCurrent] as const;
}
