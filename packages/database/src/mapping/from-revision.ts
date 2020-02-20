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
  workflowId,
}: RevisionType): Revision {
  const revision = new Revision();
  revision.id = id;
  revision.label = label;
  revision.approved = approved;
  revision.structureId = structureId;
  revision.fields = fields;
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
