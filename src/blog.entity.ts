import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';

@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})

  url: string;

  @Column({nullable:true})

  owner: string;

  @Column({nullable:true})

  repo: string;

  @Column({nullable:true})

  intr: string;

  @Column({nullable:true})
  time: string;
}
