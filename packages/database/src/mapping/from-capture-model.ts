import { CaptureModel as CaptureModelType } from '@capture-models/types';
import { CaptureModel } from '../entity/CaptureModel';
import { fromDocument } from './from-document';
import { fromRevision } from './from-revision';
import { fromStructure } from './from-structure';

export function fromCaptureModel({
  id,
  structure,
  document,
  revisions,
  contributors,
  integrity,
  target,
  derivedFrom,
  profile,
}: CaptureModelType): CaptureModel {
  const model = new CaptureModel();

  const linkedDocument = fromDocument(document);
  linkedDocument.captureModelId = id;

  return Object.assign(model, {
    id: id,
    target: target,
    structure: fromStructure(structure),
    document: linkedDocument,
    revisions: revisions ? revisions.map(fromRevision) : undefined,
    integrity,
    derivedFromId: derivedFrom ? derivedFrom : undefined,
    contributors: contributors ? Object.values(contributors) : undefined,
    profile,
  });
}
