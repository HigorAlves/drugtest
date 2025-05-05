import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  CreateIndicationUseCase,
  DeleteIndicationUseCase,
  FindAllIndicationsUseCase,
  FindIndicationByIdUseCase,
  FindIndicationsByDrugIdUseCase,
  UpdateIndicationUseCase,
} from '../../../application/indications';
import { Indication } from '../../../domain/models/indication.model';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { CreateIndicationDto, UpdateIndicationDto } from '../dtos/indications.dto';

/**
 * Controller for indication-related endpoints
 * This class adapts HTTP requests to application use cases
 */
@ApiTags('indications')
@Controller('indications')
export class IndicationsController {
  constructor(
    private readonly findAllIndicationsUseCase: FindAllIndicationsUseCase,
    private readonly findIndicationByIdUseCase: FindIndicationByIdUseCase,
    private readonly findIndicationsByDrugIdUseCase: FindIndicationsByDrugIdUseCase,
    private readonly createIndicationUseCase: CreateIndicationUseCase,
    private readonly updateIndicationUseCase: UpdateIndicationUseCase,
    private readonly deleteIndicationUseCase: DeleteIndicationUseCase
  ) {}

  /**
   * Get all indications
   * @returns Promise<Indication[]> - List of indications
   */
  @ApiOperation({ summary: 'Get all indications' })
  @ApiResponse({ status: 200, description: 'Return all indications', type: [Indication] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Indication[]> {
    return this.findAllIndicationsUseCase.execute();
  }

  /**
   * Get an indication by ID
   * @param id - Indication ID
   * @returns Promise<Indication> - Indication
   */
  @ApiOperation({ summary: 'Get an indication by ID' })
  @ApiResponse({ status: 200, description: 'Return the indication', type: Indication })
  @ApiResponse({ status: 404, description: 'Indication not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Indication> {
    return this.findIndicationByIdUseCase.execute(id);
  }

  /**
   * Get indications by drug ID
   * @param drugId - Drug ID
   * @returns Promise<Indication[]> - List of indications for the drug
   */
  @ApiOperation({ summary: 'Get indications by drug ID' })
  @ApiResponse({ status: 200, description: 'Return indications for the drug', type: [Indication] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('by-drug/:drugId')
  async findByDrugId(@Param('drugId') drugId: string): Promise<Indication[]> {
    return this.findIndicationsByDrugIdUseCase.execute(drugId);
  }

  /**
   * Create a new indication
   * @param createIndicationDto - Data for creating an indication
   * @returns Promise<Indication> - Created indication
   */
  @ApiOperation({ summary: 'Create a new indication' })
  @ApiResponse({ status: 201, description: 'The indication has been created', type: Indication })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createIndicationDto: CreateIndicationDto): Promise<Indication> {
    return this.createIndicationUseCase.execute(
      createIndicationDto.description,
      createIndicationDto.icd10Code,
      createIndicationDto.drugId,
      createIndicationDto.sourceText,
      createIndicationDto.mappingConfidence
    );
  }

  /**
   * Update an indication
   * @param id - Indication ID
   * @param updateIndicationDto - Data for updating an indication
   * @returns Promise<Indication> - Updated indication
   */
  @ApiOperation({ summary: 'Update an indication' })
  @ApiResponse({ status: 200, description: 'The indication has been updated', type: Indication })
  @ApiResponse({ status: 404, description: 'Indication not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIndicationDto: UpdateIndicationDto
  ): Promise<Indication> {
    return this.updateIndicationUseCase.execute(id, updateIndicationDto);
  }

  /**
   * Delete an indication
   * @param id - Indication ID
   * @returns Promise<void>
   */
  @ApiOperation({ summary: 'Delete an indication' })
  @ApiResponse({ status: 200, description: 'The indication has been deleted' })
  @ApiResponse({ status: 404, description: 'Indication not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteIndicationUseCase.execute(id);
  }
}