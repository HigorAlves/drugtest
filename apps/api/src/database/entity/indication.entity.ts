import { Indication as DomainIndication } from '@enterprise/domain';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DrugEntity } from './drug.entity';

@Entity('indications')
export class IndicationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  description: string;

  @Column()
  icd10Code: string;

  @Column()
  drugId: string;

  @Column({ nullable: true })
  sourceText: string;

  @Column({ type: 'float', nullable: true })
  mappingConfidence: number;

  @ManyToOne(() => DrugEntity, drug => drug.indications)
  @JoinColumn({ name: 'drugId' })
  drug: DrugEntity;

  // Convert from domain entity to TypeORM entity
  static fromDomain(indication: DomainIndication): IndicationEntity {
    const entity = new IndicationEntity();
    entity.id = indication.id;
    entity.description = indication.description;
    entity.icd10Code = indication.icd10Code;
    entity.drugId = indication.drugId;
    entity.sourceText = indication.sourceText;
    entity.mappingConfidence = indication.mappingConfidence;
    return entity;
  }

  // Convert from TypeORM entity to domain entity
  toDomain(): DomainIndication {
    return new DomainIndication({
      id: this.id,
      description: this.description,
      icd10Code: this.icd10Code,
      drugId: this.drugId,
      sourceText: this.sourceText,
      mappingConfidence: this.mappingConfidence,
    });
  }
}