import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Contributor } from './Contributor';
import { Revision } from './Revision';

@Entity()
export class RevisionAuthors {
  @PrimaryColumn()
  revisionId: string;

  @ManyToOne(
    () => Revision,
    revision => revision.authors,
    { onDelete: 'CASCADE' }
  )
  revision: Revision;

  @PrimaryColumn()
  contributorId: string;

  @ManyToOne(
    () => Contributor,
    contributor => contributor.revisions,
    { onDelete: 'CASCADE' }
  )
  contributor: Contributor;
}
