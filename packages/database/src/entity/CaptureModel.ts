import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { Contributor } from './Contributor';
import { Document } from './Document';
import { Revision } from './Revision';
import { Structure } from './Structure';

@Entity()
export class CaptureModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Structure, { onDelete: 'CASCADE' })
  structure: Structure;

  @ManyToOne(
    () => Document,
    doc => doc.captureModel
  )
  document: Document;

  @OneToMany(
    () => Revision,
    rev => rev.captureModel
  )
  revisions: Revision[];

  @Column('jsonb', { default: [] })
  target: Array<{
    id: string;
    type: string;
  }>;

  @ManyToMany(
    () => Contributor,
    contributor => contributor.captureModels
  )
  contributors: Contributor[];

  @VersionColumn()
  version: number;
}
