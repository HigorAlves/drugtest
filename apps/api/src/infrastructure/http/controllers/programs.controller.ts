import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FindProgramByIdUseCase } from '../../../application/programs';
import { Program } from '../../../domain/models/program.model';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';

/**
 * Controller for program-related endpoints
 * This class adapts HTTP requests to application use cases
 */
@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly findProgramByIdUseCase: FindProgramByIdUseCase) {}

  /**
   * Get a program by ID
   * @param id - Program ID
   * @returns Promise<Program> - Program
   */
  @ApiOperation({ summary: 'Get a program by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the program (same as drug ID)' })
  @ApiResponse({
    status: 200,
    description: 'Return the program details',
    type: Program,
  })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Program> {
    return this.findProgramByIdUseCase.execute(id);
  }
}