import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ProgramResponse, ProgramsService } from './programs.service'

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @ApiOperation({ summary: 'Get a program by ID' })
  @ApiParam({ name: 'programId', description: 'The ID of the program (same as drug ID)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the program details', 
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        labelUrl: { type: 'string' },
        indications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              description: { type: 'string' },
              icd10Code: { type: 'string' },
              mappingConfidence: { type: 'number' },
              sourceText: { type: 'string', nullable: true }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':programId')
  async findOne(@Param('programId') programId: string): Promise<ProgramResponse> {
    return this.programsService.findOne(programId)
  }
}