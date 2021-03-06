import { Revision as RevisionType } from '@capture-models/types';
import { Revision } from '../entity/Revision';
import { RevisionAuthors } from '../entity/RevisionAuthors';

export function fromRevision({
  label,
  structureId,
  approved,
  fields,
  id,
  authors,
  revises,
  status,
  source,
  workflowId,
}: RevisionType): Revision {
  const revision = new Revision();
  revision.id = id;
  revision.status = status;
  revision.label = label;
  revision.approved = approved;
  revision.structureId = structureId;
  revision.fields = fields;
  revision.source = source;
  revision.authors = authors
    ? authors.map(author => {
        const ra = new RevisionAuthors();
        ra.contributorId = author;
        ra.revisionId = id;
        return ra;
      })
    : undefined;
  revision.revisesId = revises;

  return revision;
}
