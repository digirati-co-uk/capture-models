import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CaptureModel } from './CaptureModel';
import { Property } from './Property';
import { Revision } from './Revision';
import { SelectorInstance } from './SelectorInstance';

/**
 * Document model
 *
 * Represents a document.
 *
 * @todo @context field.
 */
@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  label: string;

  @Column('text', { nullable: true })
  pluralLabel?: string;

  @Column({ nullable: true })
  revisesId?: string;

  @ManyToOne(() => Document, { onDelete: 'CASCADE', nullable: true })
  revises?: Document;

  @Column({ nullable: true })
  revisionId?: string;

  @ManyToOne(() => Revision, { onDelete: 'CASCADE', nullable: true })
  revision?: Revision;

  // @todo maybe this shouldn't be nullable?
  @Column('text', { nullable: true })
  labelledBy?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  selectorId?: string;

  @OneToOne(() => SelectorInstance, { onDelete: 'CASCADE', cascade: true, nullable: true })
  @JoinColumn()
  selector?: SelectorInstance;

  @Column('boolean', { nullable: true })
  allowMultiple?: boolean;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(
    () => Property,
    prop => prop.documentInstances,
    { nullable: true, onDelete: 'CASCADE' }
  )
  parent?: Property;

  @OneToMany(
    () => Property,
    prop => prop.document,
    { onDelete: 'CASCADE', eager: true }
  )
  properties?: Property[];

  @OneToMany(
    () => Property,
    prop => prop.rootDocument,
    { eager: true }
  )
  nestedProperties: Property[];

  @Column({ nullable: true })
  captureModelId?: string;

  @OneToOne(
    () => CaptureModel,
    model => model.document,
    { onDelete: 'CASCADE', nullable: true }
  )
  @JoinColumn()
  captureModel?: CaptureModel;

  @Column({ default: 0 })
  revisionOrder: number;

  @Column({ type: 'timestamptz', nullable: true })
  createdAt?: Date;

  @Column({ type: 'datetime', default: 'CURRENT_TIMESTAMP', nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: true })
  profile?: string;

  @Column('jsonb', { nullable: true })
  dataSources?: string[];
}
