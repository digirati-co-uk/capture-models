import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Document } from './Document';
import { Field } from './Field';
import { SelectorInstance } from './SelectorInstance';

@Entity()
export class Property {

  @Column('text', { primary: true })
  id?: string; // `${documentId}/${term}`

  @ManyToOne(
    () => Document,
    doc => doc.properties
  )
  document: Document;

  @PrimaryColumn('text')
  term: string;

  @Column('text')
  label: string;

  @Column('text')
  description: string;

  @Column('boolean')
  allowMultiple: boolean;

  @OneToOne(() => SelectorInstance, { onDelete: 'CASCADE' })
  selector?: SelectorInstance;

  @ManyToOne(() => Document)
  rootDocument: Document;

  @OneToMany(
    () => Document,
    doc => doc.parent
  )
  documentInstances: Document[];

  @OneToMany(
    () => Field,
    field => field.parent,
    { onDelete: 'CASCADE' }
  )
  fieldInstances: Field[];

  @BeforeInsert()
  generateId() {
    this.id = `${this.document.id}/${this.term}`;
  }
}
