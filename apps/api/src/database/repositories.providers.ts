import { DataSource } from 'typeorm';
import { DATABASE_PROVIDER, DRUG_REPOSITORY, INDICATION_REPOSITORY, USER_REPOSITORY } from './constants';
import { DrugEntity, IndicationEntity, UserEntity } from './entity';

export const repositoriesProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: [DATABASE_PROVIDER],
  },
  {
    provide: DRUG_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DrugEntity),
    inject: [DATABASE_PROVIDER],
  },
  {
    provide: INDICATION_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(IndicationEntity),
    inject: [DATABASE_PROVIDER],
  },
];