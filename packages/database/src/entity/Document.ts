import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(
    () => Revision,
    revision => revision.author
  )
  revisions: Revision[];

  @Column('text')
  labelledBy: string;

  @Column('text')
  description: string;

  @OneToOne(() => SelectorInstance, { onDelete: 'CASCADE' })
  selector?: SelectorInstance;

  @Column('boolean')
  allowMultiple: boolean;

  @ManyToOne(
    () => Property,
    prop => prop.documentInstances,
    { nullable: true }
  )
  parent?: Property;

  @OneToMany(
    () => Property,
    prop => prop.document,
    { onDelete: 'CASCADE' }
  )
  properties: Property[];

  @OneToMany(
    () => Property,
    prop => prop.rootDocument
  )
  nestedProperties: Property[];

  @ManyToOne(() => CaptureModel)
  captureModel: CaptureModel;
}
