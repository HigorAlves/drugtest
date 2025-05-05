import { Injectable, NotFoundException } from '@nestjs/common';

import { Program } from '../../domain/models/program.model';
import { ProgramRepository } from '../../domain/repositories/program.repository';

/**
 * Use case for finding a program by ID
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindProgramByIdUseCase {
  constructor(private readonly programRepository: ProgramRepository) {}

  /**
   * Execute the use case
   * @param id - Program ID
   * @returns Promise<Program> - Program
   * @throws NotFoundException - If program is not found
   */
  async execute(id: string): Promise<Program> {
    const program = await this.programRepository.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }
}