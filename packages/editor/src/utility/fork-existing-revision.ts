import { RevisionRequest } from '@capture-models/types';
import { generateId } from './generate-id';
import { createRevisionDocument } from './create-revision-document';
import { createRevisionRequest } from './create-revision-request';

export function forkExistingRevision(
  baseRevision: RevisionRequest,
  {
    cloneMode = 'FORK_TEMPLATE',
    modelRoot = [],
    modelMapping = {},
  }: {
    cloneMode: any;
    modelRoot: string[];
    modelMapping: Partial<{ [key: string]: string }>;
  }
) {
  // Document
  const documentToClone = baseRevision.document;
  // New id
  const newRevisionId = generateId();
  // Create document
  const newDocument = createRevisionDocument(
    newRevisionId,
    documentToClone,
    cloneMode,
    modelRoot ? modelRoot : baseRevision.modelRoot,
    modelMapping
  );
  // Add new revision request
  return createRevisionRequest(baseRevision.captureModelId as string, baseRevision.revision, newDocument);
}
