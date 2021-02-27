import { CaptureModel } from '@capture-models/types';

export function recurseRevisionDependencies(revisionId: string, revisions: CaptureModel['revisions']): string[] {
  if (!revisions) {
    return [];
  }

  const rev = revisions.find(r => r.id === revisionId);

  if (!rev) {
    return [];
  }

  if (rev.revises) {
    return [revisionId, ...recurseRevisionDependencies(rev.revises, revisions)];
  }

  return [revisionId];
}
