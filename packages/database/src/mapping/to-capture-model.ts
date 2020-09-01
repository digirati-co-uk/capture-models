import { CaptureModel as CaptureModelType, Contributor as ContributorType } from '@capture-models/types';
import { CaptureModel } from '../entity/CaptureModel';
import { toContributor } from './to-contributor';
import { toDocument } from './to-document';
import { toRevision } from './to-revision';
import { toStructure } from './to-structure';

export async function toCaptureModel(
  { document, target, structure, revisions, contributors, integrity, id, derivedFromId }: CaptureModel,
  filters: { userId?: string; revisionId?: string } = {}
): Promise<CaptureModelType> {
  const revisionIds: string[] = filters.revisionId
    ? [filters.revisionId]
    : filters.userId
    ? revisions
        .filter(rev => {
          for (const author of rev.authors) {
            if (author.contributorId === filters.userId) {
              return true;
            }
          }
          return false;
        })
        .map(rev => rev.id)
    : undefined;

  return {
    id,
    structure: await toStructure(structure),
    document: await toDocument(document, undefined, { revisionIds }),
    target,
    derivedFrom: derivedFromId ? derivedFromId : undefined,
    revisions:
      revisions && revisions.length
        ? revisions.filter(rev => (revisionIds ? revisionIds.indexOf(rev.id) !== -1 : true)).map(toRevision)
        : undefined,
    contributors:
      contributors && contributors.length
        ? contributors.map(toContributor).reduce((mappedContributors, nextContributor) => {
            mappedContributors[nextContributor.id] = nextContributor;
            return mappedContributors;
          }, {} as { [id: string]: ContributorType })
        : undefined,
    integrity: integrity ? integrity : undefined,
  };
}
