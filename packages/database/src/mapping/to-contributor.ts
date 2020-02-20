import { Contributor as ContributorType } from '../../../types/src/capture-model';
import { Contributor } from '../entity/Contributor';

export function toContributor({
  id,
  email,
  // eslint-disable-next-line @typescript-eslint/camelcase
  email_sha1,
  homepage,
  name,
  nickname,
  type,
}: Contributor): ContributorType {
  return {
    id,
    type: type as any,
    email,
    // eslint-disable-next-line @typescript-eslint/camelcase
    email_sha1,
    homepage,
    nickname,
    name,
  };
}
