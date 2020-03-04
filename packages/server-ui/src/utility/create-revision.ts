import { RevisionRequest } from '@capture-models/types';

export async function createRevision(req: RevisionRequest): Promise<RevisionRequest> {
  return await fetch(`/api/model/${req.captureModelId}/revision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })
    .then(r => r.json())
    .catch(err => {
      throw err;
    });
}
