import { RefinementContext, RefinementSupportProps, RefinementType, UnknownRefinement } from '@capture-models/types';
import { PluginContext } from '../context';
import React, { useContext, useMemo } from 'react';

export function useRefinement<Ref extends UnknownRefinement = UnknownRefinement>(
  type: string,
  subject: { instance: RefinementType<Ref>; property: string },
  context: RefinementSupportProps & RefinementContext<Ref>
): Ref | null {
  const ctx = useContext(PluginContext);
  const refinements = useMemo(() => ctx.refinements.filter(r => r.type === type), [ctx.refinements, type]) as Ref[];

  if (type === 'entity') {
    console.log(refinements);
  }

  return useMemo(() => {
    if (!subject) {
      return null;
    }
    for (const refinement of refinements) {
      const match = refinement.supports(subject as any, context as any);
      if (match) {
        return refinement;
      }
    }
    return null;
  }, [context, refinements, subject]);
}
