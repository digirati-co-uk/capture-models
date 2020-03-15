import { RevisionRequest } from '@capture-models/types';

export async function updateRevision(req: RevisionRequest, status?: string): Promise<RevisionRequest> {
  console.log('Saving revision...', status);
  return await fetch(`/api/crowdsourcing/revision/${req.revision.id}`, {
    method: 'PUT',
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
