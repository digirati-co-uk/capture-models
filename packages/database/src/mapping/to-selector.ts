import { BaseSelector } from '@capture-models/types';
import { SelectorInstance } from '../entity/SelectorInstance';

export function toSelector({
  configuration,
  type,
  state,
  id,
  revisedBy,
  revisesId,
  revisionId,
}: SelectorInstance): BaseSelector {
  return {
    id,
    type,
    state,
    revises: revisesId || undefined,
    revisionId: revisionId || undefined,
    revisedBy: revisedBy && revisedBy.length ? revisedBy.map(selector => toSelector(selector)) : undefined,
    ...configuration,
  };
}
