import { RevisionRequest } from '../../../types/src/revision-request';
import { Revision } from '../entity/Revision';
import { RevisionAuthors } from '../entity/RevisionAuthors';

export function fromRevisionRequest(revisionRequest: RevisionRequest): Revision {
  const {
    label,
    structureId,
    approved,
    fields,
    id,
    authors,
    revises,
    status,
    deletedFields,
  } = revisionRequest.revision;
  const { captureModelId, author, source } = revisionRequest;

  const allAuthors = authors ? authors : [];
  // Authors or author if not already added.
  if (author && allAuthors.indexOf(author.id) === -1) {
    allAuthors.push(author.id);
  }

  const revision = new Revision();
  revision.id = id;
  revision.status = status;
  revision.label = label;
  revision.approved = approved;
  revision.structureId = structureId;
  revision.fields = fields;
  revision.source = source;
  revision.authors = allAuthors.length
    ? allAuthors.map(otherAuthor => {
        const ra = new RevisionAuthors();
        ra.contributorId = otherAuthor;
        ra.revisionId = id;
        return ra;
      })
    : undefined;
  revision.revisesId = revises;
  revision.captureModelId = captureModelId;
  revision.deletedFields = deletedFields;

  return revision;
}
