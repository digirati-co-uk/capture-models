// Revision by capture model (obv)
import { ModelFields } from '@capture-models/types';
// Revision by user
// Revision by user type
// Revision by target (regardless of capture model)
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { CaptureModel } from './CaptureModel';
import { Contributor } from './Contributor';
import { Field } from './Field';
import { RevisionAuthors } from './RevisionAuthors';
import { Structure } from './Structure';

@Entity()
export class Revision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  label: string;

  @Column({ nullable: true })
  structureId: string;

  @ManyToOne(() => Structure, { nullable: true })
  structure?: Structure;

  @OneToMany(
    () => RevisionAuthors,
    ra => ra.revision,
    { eager: true, cascade: true }
  )
  authors?: RevisionAuthors[];

  @Column('jsonb')
  fields: ModelFields;

  @Column('boolean', { default: false })
  approved: boolean;

  @Column({ nullable: true })
  revisesId?: string;

  @ManyToOne(() => Revision, { nullable: true })
  revises?: Revision;

  @Column({ nullable: true })
  captureModelId?: string;

  @ManyToOne(
    () => CaptureModel,
    model => model.revisions,
    { onDelete: 'CASCADE', nullable: true }
  )
  captureModel?: CaptureModel;

  @OneToMany(
    () => Field,
    field => field.revision
  )
  revisionFields: Field[];

  @VersionColumn()
  version?: number;
}
