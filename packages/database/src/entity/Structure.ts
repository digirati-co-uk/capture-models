import { CaptureModel, ModelFields } from '@capture-models/types';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum StructureTypes {
  CHOICE = 'choice',
  MODEL = 'model',
}

/**
 * Structure model
 *
 * Represents a single level of a structure. The top level structure, attached
 *
 * @todo Postgres view for top level structures: https://typeorm.io/#/view-entities
 * @todo function: https://wiki.postgresql.org/wiki/Getting_list_of_all_children_from_adjacency_tree
 * @todo Postgres function to get required document fields
 * @todo mapper - https://typeorm.io/#/active-record-data-mapper
 * @todo Before import - add parent root choice recursively: https://typeorm.io/#/listeners-and-subscribers/beforeinsert
 * @todo add lifecycle and owner fields.
 */
@Entity()
export class Structure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { default: 'Untitled structure' })
  label: string;

  @Column('simple-array', { nullable: true })
  profile: string[];

  @Column('int8', { default: 0 })
  order: number;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: StructureTypes,
    default: StructureTypes.CHOICE,
  })
  type: 'choice' | 'model';

  @OneToMany(
    () => Structure,
    structure => structure.parentChoice,
    { cascade: true }
  )
  items: Structure[];

  @OneToMany(
    () => Structure,
    structure => structure.rootChoice,
    { lazy: true }
  )
  flatItems: Promise<Structure[]>;

  @ManyToOne(
    () => Structure,
    structure => structure.items,
    { nullable: true, lazy: true }
  )
  parentChoice?: Promise<Structure>;

  @ManyToOne(
    () => Structure,
    structure => structure.items,
    { nullable: true }
  )
  rootChoice?: Structure;

  @Column('jsonb', { nullable: true })
  fields: ModelFields;
}
