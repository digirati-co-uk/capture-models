import { CaptureModel as CaptureModelType, Contributor as ContributorType } from '@capture-models/types';
import { CaptureModel } from '../entity/CaptureModel';
import { toContributor } from './to-contributor';
import { toDocument } from './to-document';
import { toRevision } from './to-revision';
import { toStructure } from './to-structure';

function recurseRevisionDependencies(revisionId: string, revisions: CaptureModel['revisions']): string[] {
  const rev = revisions.find(r => r.id === revisionId);

  if (!rev) {
    return [];
  }

  if (rev.revisesId) {
    return [revisionId, ...recurseRevisionDependencies(rev.revisesId, revisions)];
  }

  return [revisionId];
}

export async function toCaptureModel(
  { document, target, structure, revisions, contributors, integrity, id, derivedFromId, profile }: CaptureModel,
  filters: {
    userId?: string;
    revisionId?: string;
    revisionStatus?: string;
    onlyRevisionFields?: boolean;
    showAllRevisions?: boolean;
  } = {}
): Promise<CaptureModelType> {
  const baseRevisionIds: string[] =
    (filters.userId || filters.revisionStatus) && !filters.showAllRevisions
      ? revisions
          .filter(rev => {
            if (filters.revisionId && filters.revisionId !== rev.id) {
              return false;
            }
            if (filters.revisionStatus && rev.status !== filters.revisionStatus) {
              return false;
            }
            if (filters.userId) {
              for (const author of rev.authors) {
                if (author.contributorId === filters.userId) {
                  return true;
                }
              }
              return false;
            }
            return true;
          })
          .map(rev => rev.id)
      : filters.revisionId
      ? [filters.revisionId]
      : undefined;

  const revisionIds = baseRevisionIds
    ? baseRevisionIds
        .map(rid => recurseRevisionDependencies(rid, revisions))
        .reduce((acc, next) => {
          return [...acc, ...next];
        }, [] as string[])
    : undefined;

  const publishedRevisions = revisions.filter(r => r.approved);
  const publishedRevisionIds = publishedRevisions.map(r => r.id);
  const idsRemovedByPublishedRevisions = [];
  for (const publishedRevision of publishedRevisions) {
    if (publishedRevision.deletedFields) {
      idsRemovedByPublishedRevisions.push(...publishedRevision.deletedFields);
    }
  }

  return {
    id,
    structure: await toStructure(structure),
    document: await toDocument(document, undefined, {
      revisionIds,
      publishedRevisionIds,
      idsRemovedByPublishedRevisions,
      onlyRevisionFields: filters.onlyRevisionFields,
    }),
    target,
    profile,
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
