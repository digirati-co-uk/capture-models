// Revision by capture model (obv)
import { ModelFields } from '@capture-models/types';
// Revision by user
// Revision by user type
// Revision by target (regardless of capture model)
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { CaptureModel } from './CaptureModel';
import { Contributor } from './Contributor';
import { Structure } from './Structure';

@Entity()
export class Revision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  label: string;

  @ManyToOne(() => Structure, { nullable: true })
  structure?: Structure;

  @ManyToMany(
    () => Contributor,
    contributor => contributor.revisions
  )
  author: Contributor[];

  @Column('jsonb')
  fields: ModelFields;

  @Column('boolean', { default: false })
  approved: boolean;

  @ManyToOne(() => Revision, { nullable: true })
  revises?: Revision;

  @ManyToOne(
    () => CaptureModel,
    model => model.revisions
  )
  captureModel: CaptureModel;

  @VersionColumn()
  version: number;
}
