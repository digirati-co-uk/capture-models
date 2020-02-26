// One to one with field instance or document.
// Hidden value contains the target (?)
// Value field is JSON as string
import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

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
}
