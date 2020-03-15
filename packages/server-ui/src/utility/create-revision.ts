import { RevisionRequest } from '@capture-models/types';

export async function createRevision(req: RevisionRequest, status?: string): Promise<RevisionRequest> {
  return await fetch(`/api/crowdsourcing/model/${req.captureModelId}/revision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(status ? { ...req, revision: { ...req.revision, status } } : req),
  })
    .then(r => r.json())
    .catch(err => {
      throw err;
    });
}
