// This is an instance of a field template. It will contain it's position in the document and the base capture model
// where it was created. It will also contain a link to a revision, which contains creator information. Any overrides
// from the template will also be applied.
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { Contributor } from './Contributor';
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
  description?: string;

  @Column({ nullable: true })
  selectorId?: string;

  @OneToOne(() => SelectorInstance, { onDelete: 'CASCADE', eager: true, nullable: true })
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

  @Column('jsonb')
  value: any;

  @Column('text', { nullable: true })
  valueString?: any;

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
}
