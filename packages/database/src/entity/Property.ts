import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Document } from './Document';
import { Field } from './Field';

@Entity()
export class Property {
  @Column('text', { primary: true })
  id?: string; // `${documentId}/${term}`

  @Column({ nullable: true })
  documentId?: string;

  @ManyToOne(
    () => Document,
    doc => doc.properties,
    { onDelete: 'CASCADE', cascade: true }
  )
  document?: Document;

  @Column('text')
  type: string;

  @Column('text')
  term: string;

  @Column({ nullable: true })
  rootDocumentId?: string;

  @ManyToOne(() => Document, { nullable: true, onDelete: 'CASCADE' })
  rootDocument?: Document;

  @OneToMany(
    () => Document,
    doc => doc.parent,
    { onDelete: 'CASCADE', lazy: true }
  )
  documentInstances?: Promise<Document[]>;

  @OneToMany(
    () => Field,
    field => field.parent,
    { onDelete: 'CASCADE', lazy: true }
  )
  fieldInstances?: Promise<Field[]>;
}
