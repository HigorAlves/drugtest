import { Drug as DomainDrug } from '@enterprise/domain';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { IndicationEntity } from './indication.entity';

@Entity('drugs')
export class DrugEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  labelUrl: string;

  @OneToMany(() => IndicationEntity, indication => indication.drug)
  indications: IndicationEntity[];

  // Convert from domain entity to TypeORM entity
  static fromDomain(drug: DomainDrug): DrugEntity {
    const entity = new DrugEntity();
    entity.id = drug.id;
    entity.name = drug.name;
    entity.labelUrl = drug.labelUrl;
    return entity;
  }

  // Convert from TypeORM entity to domain entity
  toDomain(): DomainDrug {
    return new DomainDrug({
      id: this.id,
      name: this.name,
      labelUrl: this.labelUrl,
    });
  }
}