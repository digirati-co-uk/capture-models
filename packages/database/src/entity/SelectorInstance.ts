// One to one with field instance or document.
// Hidden value contains the target (?)
// Value field is JSON as string
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { Revision } from './Revision';

@Entity()
export class SelectorInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  type: string;

  @Column('jsonb', { nullable: true })
  state: any;

  @Column('jsonb')
  configuration: any;

  @VersionColumn()
  version: number;

  @Column({ nullable: true })
  revisesId?: string;

  @ManyToOne(() => SelectorInstance, { onDelete: 'SET NULL', nullable: true, lazy: true })
  revises?: Promise<SelectorInstance>;

  @OneToMany(
    () => SelectorInstance,
    rev => rev.revises,
    { eager: true }
  )
  revisedBy?: SelectorInstance[];

  @Column({ nullable: true })
  revisionId?: string;

  @ManyToOne(() => Revision, { onDelete: 'CASCADE', nullable: true })
  revision?: Revision;
}
