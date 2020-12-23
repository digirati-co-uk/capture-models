// This is an instance of a field template. It will contain it's position in the document and the base capture model
// where it was created. It will also contain a link to a revision, which contains creator information. Any overrides
// from the template will also be applied.
import {
  Column,
  Entity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { Property } from './Property';
import { Revision } from './Revision';
import { SelectorInstance } from './SelectorInstance';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  type: string;

  @Column('text')
  label: string;

  @Column('text', { nullable: true })
  pluralLabel?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  selectorId?: string;

  @OneToOne(() => SelectorInstance, { onDelete: 'CASCADE', cascade: true, eager: true, nullable: true })
  @JoinColumn()
  selector?: SelectorInstance;

  @Column('boolean', { nullable: true })
  allowMultiple?: boolean;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  parent?: Property;

  @Column('jsonb')
  additionalProperties: any;

  @Column('jsonb', { nullable: true })
  value: any;

  @Column('text', { nullable: true })
  valueString?: any;

  @Column({ nullable: true })
  revisesId?: string;

  @ManyToOne(() => Field, { nullable: true, onDelete: 'CASCADE' })
  revises?: Field;

  @Column({ nullable: true })
  revisionId?: string;

  @ManyToOne(
    () => Revision,
    rev => rev.revisionFields,
    { nullable: true, onDelete: 'CASCADE' }
  )
  revision?: Revision;

  @VersionColumn()
  version: number;

  @Column({ default: 0 })
  revisionOrder: number;

  @Column({ type: 'datetime', default: 'CURRENT_TIMESTAMP', nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Column({ type: 'datetime', default: 'CURRENT_TIMESTAMP', nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: true })
  profile?: string;

  @Column('jsonb', { nullable: true })
  dataSources?: string[];
}
