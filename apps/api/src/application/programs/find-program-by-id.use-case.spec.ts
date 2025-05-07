import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindProgramByIdUseCase } from './find-program-by-id.use-case';
import { Program } from '../../domain/models/program.model';
import { ProgramRepository } from '../../domain/repositories/program.repository';

describe('FindProgramByIdUseCase', () => {
  let useCase: FindProgramByIdUseCase;
  let programRepository: ProgramRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProgramByIdUseCase,
        {
          provide: 'ProgramRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindProgramByIdUseCase>(FindProgramByIdUseCase);
    programRepository = module.get<ProgramRepository>('ProgramRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a program when found', async () => {
      // Arrange
      const programId = 'program-123';
      const mockProgram: Program = {
        id: programId,
        name: 'Test Program',
        labelUrl: 'https://example.com/label.pdf',
        indications: [
          {
            id: 'indication-1',
            description: 'Hypertension',
            icd10Code: 'I10',
            drugId: 'drug-123',
            sourceText: 'Hypertension',
            mappingConfidence: 0.95,
          },
          {
            id: 'indication-2',
            description: 'Diabetes',
            icd10Code: 'E11',
            drugId: 'drug-123',
            sourceText: 'Diabetes',
            mappingConfidence: 0.92,
          },
        ],
      };

      jest.spyOn(programRepository, 'findById').mockResolvedValue(mockProgram);

      // Act
      const result = await useCase.execute(programId);

      // Assert
      expect(result).toEqual(mockProgram);
      expect(programRepository.findById).toHaveBeenCalledWith(programId);
    });

    it('should throw NotFoundException when program is not found', async () => {
      // Arrange
      const programId = 'nonexistent-program';

      jest.spyOn(programRepository, 'findById').mockResolvedValue(undefined);

      // Act & Assert
      await expect(useCase.execute(programId)).rejects.toThrow(
        new NotFoundException(`Program with ID ${programId} not found`)
      );
      expect(programRepository.findById).toHaveBeenCalledWith(programId);
    });
  });
});
