import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Drug } from '../../../domain/models/drug.model';
import { 
  FindAllDrugsUseCase,
  FindDrugByIdUseCase,
  CreateDrugUseCase,
  UpdateDrugUseCase,
  DeleteDrugUseCase
} from '../../../application/drugs';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { CreateDrugDto, UpdateDrugDto } from '../dtos/drugs.dto';

/**
 * Controller for drug-related endpoints
 * This class adapts HTTP requests to application use cases
 */
@ApiTags('drugs')
@Controller('drugs')
export class DrugsController {
  constructor(
    private readonly findAllDrugsUseCase: FindAllDrugsUseCase,
    private readonly findDrugByIdUseCase: FindDrugByIdUseCase,
    private readonly createDrugUseCase: CreateDrugUseCase,
    private readonly updateDrugUseCase: UpdateDrugUseCase,
    private readonly deleteDrugUseCase: DeleteDrugUseCase
  ) {}

  /**
   * Get all drugs
   * @returns Promise<Drug[]> - List of drugs
   */
  @ApiOperation({ summary: 'Get all drugs' })
  @ApiResponse({ status: 200, description: 'Return all drugs', type: [Drug] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Drug[]> {
    return this.findAllDrugsUseCase.execute();
  }

  /**
   * Get a drug by ID
   * @param id - Drug ID
   * @returns Promise<Drug> - Drug
   */
  @ApiOperation({ summary: 'Get a drug by ID' })
  @ApiResponse({ status: 200, description: 'Return the drug', type: Drug })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Drug> {
    return this.findDrugByIdUseCase.execute(id);
  }

  /**
   * Create a new drug
   * @param createDrugDto - Data for creating a drug
   * @returns Promise<Drug> - Created drug
   */
  @ApiOperation({ summary: 'Create a new drug' })
  @ApiResponse({ status: 201, description: 'The drug has been created', type: Drug })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDrugDto: CreateDrugDto): Promise<Drug> {
    return this.createDrugUseCase.execute(createDrugDto.name, createDrugDto.labelUrl);
  }

  /**
   * Update a drug
   * @param id - Drug ID
   * @param updateDrugDto - Data for updating a drug
   * @returns Promise<Drug> - Updated drug
   */
  @ApiOperation({ summary: 'Update a drug' })
  @ApiResponse({ status: 200, description: 'The drug has been updated', type: Drug })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto): Promise<Drug> {
    return this.updateDrugUseCase.execute(id, updateDrugDto);
  }

  /**
   * Delete a drug
   * @param id - Drug ID
   * @returns Promise<void>
   */
  @ApiOperation({ summary: 'Delete a drug' })
  @ApiResponse({ status: 200, description: 'The drug has been deleted' })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteDrugUseCase.execute(id);
  }
}
