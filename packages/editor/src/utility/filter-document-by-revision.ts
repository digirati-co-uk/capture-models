import { CaptureModel, Revision } from '@capture-models/types';
import { filterCaptureModel } from './filter-capture-model';
import { expandModelFields } from '../core/structure-editor';

export function filterDocumentByRevision(
  document: CaptureModel['document'],
  revision: Revision
): CaptureModel['document'] | null {
  return filterCaptureModel(revision.id, document, expandModelFields(revision.fields), field => {
    return field.revision ? field.revision === revision.id : false;
  });
}
