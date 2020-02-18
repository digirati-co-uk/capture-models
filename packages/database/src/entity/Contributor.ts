import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CaptureModel } from './CaptureModel';
import { Revision } from './Revision';

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
  type: ContributorTypes;

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

  @OneToMany(
    () => CaptureModel,
    model => model.contributors
  )
  captureModels: CaptureModel[];

  @OneToMany(
    () => Revision,
    revision => revision.author
  )
  revisions: Revision[];
}
