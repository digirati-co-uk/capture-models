import { Revision as RevisionType, StatusTypes } from '@capture-models/types';
import { Revision } from '../entity/Revision';

export function toRevision({
  authors,
  structureId,
  approved,
  label,
  id,
  fields,
  revisesId,
  status,
}: Revision): RevisionType {
  return {
    structureId,
    approved,
    label,
    id,
    fields,
    status,
    revises: revisesId,
    authors: (authors || []).map(author => author.contributorId),
  };
}
