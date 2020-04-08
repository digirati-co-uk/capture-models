import { Revision } from '../entity/Revision';
import { RevisionAuthors } from '../entity/RevisionAuthors';

export function diffAuthors(originalRev: Revision, newRev: Revision) {
  const originalAuthors = (originalRev.authors || []).map(a => a.contributorId);
  const newAuthors = (newRev.authors || []).map(a => a.contributorId);

  const toAdd = newAuthors.filter(a => originalAuthors.indexOf(a) === -1);
  const toRemove = originalAuthors.filter(a => newAuthors.indexOf(a) === -1);

  console.log({toAdd, toRemove});

  return {
    toAdd: toAdd.map(id => {
      const ra = new RevisionAuthors();
      ra.contributorId = id;
      ra.revisionId = newRev.id;
      return ra;
    }),
    toRemove: toRemove.map(id => {
      const ra = new RevisionAuthors();
      ra.contributorId = id;
      ra.revisionId = newRev.id;
      return ra;
    }),
  };
}
