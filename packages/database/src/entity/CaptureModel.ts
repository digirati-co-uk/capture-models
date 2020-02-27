import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { Contributor } from './Contributor';
import { Document } from './Document';
import { Revision } from './Revision';
import { Structure } from './Structure';

@Entity()
export class CaptureModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  structureId: string;

  @ManyToOne(() => Structure, { eager: true })
  @JoinColumn()
  structure: Structure;

  @OneToOne(
    () => Document,
    doc => doc.captureModel,
    { onDelete: 'CASCADE', eager: true }
  )
  document: Document;

  @OneToMany(
    () => Revision,
    rev => rev.captureModel,
    { eager: true }
  )
  revisions?: Revision[];

  @Column('jsonb', { nullable: true })
  target?: Array<{
    id: string;
    type: string;
  }>;

  @Column('jsonb', { nullable: true })
  integrity?: any;

  // @ManyToMany(
  //   () => Contributor,
  //   contributor => contributor.captureModels,
  //   { nullable: true }
  // )
  contributors?: Contributor[];

  @Column({ nullable: true })
  derivedFromId?: string;

  @ManyToOne(() => CaptureModel, { nullable: true })
  derivedFrom?: CaptureModel;

  @VersionColumn()
  version?: number;
}
