import { Revision as RevisionType } from '../../../types/src/capture-model';
import { Revision } from '../entity/Revision';

export function toRevision({ authors, structureId, approved, label, id, fields, revisesId }: Revision): RevisionType {
  return {
    structureId,
    approved,
    label,
    id,
    fields,
    revises: revisesId,
    authors: authors.map(author => author.contributorId),
  };
}
