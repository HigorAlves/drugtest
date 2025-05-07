import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { CreateIndicationUseCase } from './create-indication.use-case';
import { Indication } from '../../domain/models/indication.model';
import { IndicationRepository } from '../../domain/repositories/indication.repository';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('123e4567-e89b-12d3-a456-426614174000'),
}));

describe('CreateIndicationUseCase', () => {
  let useCase: CreateIndicationUseCase;
  let indicationRepository: IndicationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateIndicationUseCase,
        {
          provide: 'IndicationRepository',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateIndicationUseCase>(CreateIndicationUseCase);
    indicationRepository = module.get<IndicationRepository>('IndicationRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new indication with generated UUID', async () => {
      // Arrange
      const description = 'Essential hypertension';
      const icd10Code = 'I10';
      const drugId = '123e4567-e89b-12d3-a456-426614174001';
      const sourceText = 'Hypertension';
      const mappingConfidence = 0.95;

      const expectedIndication = new Indication({
        id: '123e4567-e89b-12d3-a456-426614174000',
        description,
        icd10Code,
        drugId,
        sourceText,
        mappingConfidence,
      });

      jest.spyOn(indicationRepository, 'create').mockResolvedValue(expectedIndication);

      // Act
      const result = await useCase.execute(
        description,
        icd10Code,
        drugId,
        sourceText,
        mappingConfidence
      );

      // Assert
      expect(result).toEqual(expectedIndication);
      expect(uuidv4).toHaveBeenCalled();
      expect(indicationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          description,
          icd10Code,
          drugId,
          sourceText,
          mappingConfidence,
        })
      );
    });
  });
});
