import { expandModelFields } from '../../../core/structure-editor';
import { CaptureModel } from '@capture-models/types';
import { filterCaptureModel } from '../../../utility/filter-capture-model';
import { RevisionItem } from './capture-model-to-revision-list';

export function revisionFilter(captureModel: CaptureModel, revision: string): RevisionItem | null {
  const revisionDescription = captureModel.revisions ? captureModel.revisions.find(item => item.id === revision) : null;
  if (!revisionDescription) {
    return null;
  }

  const model = filterCaptureModel(
    revisionDescription.id,
    captureModel.document,
    expandModelFields(revisionDescription.fields),
    field => {
      return field.revision ? field.revision === revision : false;
    }
  );

  if (!model) {
    return null;
  }

  return {
    document: model,
    revision: revisionDescription,
  };
}
