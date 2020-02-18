// This is an instance of a field template. It will contain it's position in the document and the base capture model
// where it was created. It will also contain a link to a revision, which contains creator information. Any overrides
// from the template will also be applied.
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
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

  @Column('text')
  description: string;

  @OneToOne(() => SelectorInstance, { onDelete: 'CASCADE' })
  selector?: SelectorInstance;

  @Column('boolean')
  allowMultiple: boolean;

  @ManyToOne(() => Contributor)
  creator: Contributor;

  @ManyToOne(() => Property)
  parent: Property;

  @Column('jsonb')
  additionalProperties: any;

  @ManyToOne(() => Revision, { nullable: true })
  revision?: Revision;

  @VersionColumn()
  version: number;
}
