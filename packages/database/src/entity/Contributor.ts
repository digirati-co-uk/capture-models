import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CaptureModel } from './CaptureModel';
import { RevisionAuthors } from './RevisionAuthors';

export enum ContributorTypes {
  PERSON = 'Person',
  ORG = 'Organization',
  SOFTWARE = 'Software',
}

@Entity()
export class Contributor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContributorTypes,
    default: ContributorTypes.PERSON,
  })
  type: string;

  @Column('text', { nullable: true })
  email?: string;

  @Column('text', { nullable: true })
  homepage?: string;

  @Column('text', { nullable: true })
  email_sha1?: string;

  @Column('text', { nullable: true })
  name?: string;

  @Column('text', { nullable: true })
  nickname?: string;

  @ManyToMany(
    () => CaptureModel,
    model => model.contributors,
    { nullable: true }
  )
  captureModels?: CaptureModel[];

  @OneToMany(
    () => RevisionAuthors,
    ra => ra.contributor,
    { nullable: true }
  )
  revisions?: RevisionAuthors[];
}
