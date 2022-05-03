import { BaseSelector } from '@capture-models/types';
import { SelectorInstance } from '../entity/SelectorInstance';

export async function toSelector({
  configuration,
  type,
  state,
  id,
  revisedBy: _revisedBy,
  revisesId,
  revisionId,
}: SelectorInstance): Promise<BaseSelector> {
  const revisedBy = await _revisedBy;
  return {
    id,
    type,
    state,
    revises: revisesId || undefined,
    revisionId: revisionId || undefined,
    revisedBy:
      revisedBy && revisedBy.length ? await Promise.all(revisedBy.map(selector => toSelector(selector))) : undefined,
    ...configuration,
  };
}
