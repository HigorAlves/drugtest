import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole, Drug, Indication } from '@enterprise/domain';
import { DatabaseModule } from '../database.module';
import { DRUG_REPOSITORY, INDICATION_REPOSITORY, USER_REPOSITORY } from '../constants';
import { DrugEntity, IndicationEntity, UserEntity } from '../entity';

describe('Database Module', () => {
  let module: TestingModule;
  let userRepository: Repository<UserEntity>;
  let drugRepository: Repository<DrugEntity>;
  let indicationRepository: Repository<IndicationEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    userRepository = module.get(USER_REPOSITORY);
    drugRepository = module.get(DRUG_REPOSITORY);
    indicationRepository = module.get(INDICATION_REPOSITORY);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('User Repository', () => {
    it('should create and retrieve a user', async () => {
      // Create a test user
      const testUser = new User({
        id: uuidv4(),
        username: 'testuser',
        passwordHash: 'testhash',
        role: UserRole.USER,
      });

      // Convert to entity and save
      const userEntity = UserEntity.fromDomain(testUser);
      await userRepository.save(userEntity);

      // Retrieve the user
      const retrievedUser = await userRepository.findOne({ where: { username: 'testuser' } });
      
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser.username).toBe('testuser');
      
      // Clean up
      await userRepository.remove(retrievedUser);
    });
  });

  describe('Drug Repository', () => {
    it('should create and retrieve a drug', async () => {
      // Create a test drug
      const testDrug = new Drug({
        id: uuidv4(),
        name: 'Test Drug',
        labelUrl: 'https://example.com/label',
      });

      // Convert to entity and save
      const drugEntity = DrugEntity.fromDomain(testDrug);
      await drugRepository.save(drugEntity);

      // Retrieve the drug
      const retrievedDrug = await drugRepository.findOne({ where: { name: 'Test Drug' } });
      
      expect(retrievedDrug).toBeDefined();
      expect(retrievedDrug.name).toBe('Test Drug');
      
      // Clean up
      await drugRepository.remove(retrievedDrug);
    });
  });

  describe('Indication Repository', () => {
    it('should create and retrieve an indication', async () => {
      // Create a test drug first
      const testDrug = new Drug({
        id: uuidv4(),
        name: 'Test Drug for Indication',
        labelUrl: 'https://example.com/label',
      });
      const drugEntity = DrugEntity.fromDomain(testDrug);
      await drugRepository.save(drugEntity);

      // Create a test indication
      const testIndication = new Indication({
        id: uuidv4(),
        description: 'Test Indication',
        icd10Code: 'T123',
        drugId: drugEntity.id,
        sourceText: 'Source text',
        mappingConfidence: 0.95,
      });

      // Convert to entity and save
      const indicationEntity = IndicationEntity.fromDomain(testIndication);
      await indicationRepository.save(indicationEntity);

      // Retrieve the indication
      const retrievedIndication = await indicationRepository.findOne({ 
        where: { description: 'Test Indication' },
        relations: ['drug'],
      });
      
      expect(retrievedIndication).toBeDefined();
      expect(retrievedIndication.description).toBe('Test Indication');
      expect(retrievedIndication.drug).toBeDefined();
      expect(retrievedIndication.drug.name).toBe('Test Drug for Indication');
      
      // Clean up
      await indicationRepository.remove(retrievedIndication);
      await drugRepository.remove(drugEntity);
    });
  });
});