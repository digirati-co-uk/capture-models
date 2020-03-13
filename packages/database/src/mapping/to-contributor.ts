import { Contributor as ContributorType } from '@capture-models/types';
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
    name: name ? name : 'Anonymous user',
    email: email ? email : undefined,
    // eslint-disable-next-line @typescript-eslint/camelcase
    email_sha1: email_sha1 ? email_sha1 : undefined,
    homepage: homepage ? homepage : undefined,
    nickname: nickname ? nickname : undefined,
  };
}
