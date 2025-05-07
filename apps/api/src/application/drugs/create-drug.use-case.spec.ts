import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { Drug } from '../../domain/models/drug.model';
import { DrugRepository } from '../../domain/repositories/drug.repository';
import { CreateDrugUseCase } from './create-drug.use-case';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('123e4567-e89b-12d3-a456-426614174000'),
}));

describe('CreateDrugUseCase', () => {
  let useCase: CreateDrugUseCase;
  let drugRepository: DrugRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDrugUseCase,
        {
          provide: 'DrugRepository',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateDrugUseCase>(CreateDrugUseCase);
    drugRepository = module.get<DrugRepository>('DrugRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new drug with generated UUID', async () => {
      // Arrange
      const name = 'Test Drug';
      const labelUrl = 'https://example.com/drug-label.pdf';

      const expectedDrug = new Drug({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name,
        labelUrl,
      });

      jest.spyOn(drugRepository, 'create').mockResolvedValue(expectedDrug);

      // Act
      const result = await useCase.execute(name, labelUrl);

      // Assert
      expect(result).toEqual(expectedDrug);
      expect(uuidv4).toHaveBeenCalled();
      expect(drugRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name,
          labelUrl,
        })
      );
    });
  });
});
