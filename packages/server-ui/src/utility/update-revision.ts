import { RevisionRequest } from '@capture-models/types';

export async function updateRevision(req: RevisionRequest): Promise<RevisionRequest> {
  return await fetch(`/api/revision/${req.revision.id}`, {
    method: 'PUT',
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
