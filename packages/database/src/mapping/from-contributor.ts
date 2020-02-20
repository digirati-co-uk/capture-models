import { Contributor as ContributorType } from '@capture-models/types';
import { Contributor } from '../entity/Contributor';

export function fromContributor({
  name,
  nickname,
  homepage,
  // eslint-disable-next-line @typescript-eslint/camelcase
  email_sha1,
  id,
  type,
  email,
}: ContributorType): Contributor {
  return {
    email,
    type,
    id,
    // eslint-disable-next-line @typescript-eslint/camelcase
    email_sha1,
    homepage,
    nickname,
    name,
  };
}
