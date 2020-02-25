import { RevisionRequest } from '../../../types/src/revision-request';
import { Revision } from '../entity/Revision';
import { RevisionAuthors } from '../entity/RevisionAuthors';

export function fromRevisionRequest(revisionRequest: RevisionRequest): Revision {
  const { label, structureId, approved, fields, id, authors, revises, status } = revisionRequest.revision;
  const { captureModelId, author, source } = revisionRequest;

  // Authors or author if not already added.
  if (authors && author && authors.indexOf(author.id) === -1) {
    authors.push(author.id);
  }

  const revision = new Revision();
  revision.id = id;
  revision.status = status;
  revision.label = label;
  revision.approved = approved;
  revision.structureId = structureId;
  revision.fields = fields;
  revision.source = source;
  revision.authors = authors
    ? authors.map(otherAuthor => {
        const ra = new RevisionAuthors();
        ra.contributorId = otherAuthor;
        ra.revisionId = id;
        return ra;
      })
    : undefined;
  revision.revisesId = revises;
  revision.captureModelId = captureModelId;

  return revision;
}
