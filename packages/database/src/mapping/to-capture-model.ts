import { CaptureModel as CaptureModelType } from '@capture-models/types';
import { CaptureModel } from '../entity/CaptureModel';
import { toContributor } from './to-contributor';
import { toDocument } from './to-document';
import { toRevision } from './to-revision';
import { toStructure } from './to-structure';

export async function toCaptureModel({
  document,
  target,
  structure,
  revisions,
  contributors,
  integrity,
  id,
}: CaptureModel): Promise<CaptureModelType> {
  return {
    id,
    structure: await toStructure(structure),
    document: await toDocument(document),
    target,
    revisions: revisions && revisions.length ? revisions.map(toRevision) : undefined,
    contributors:
      contributors && contributors.length
        ? contributors.map(toContributor).reduce((mappedContributors, nextContributor) => {
            mappedContributors[nextContributor.id] = nextContributor;
            return mappedContributors;
          }, {})
        : undefined,
    integrity: integrity ? integrity : undefined,
  };
}
