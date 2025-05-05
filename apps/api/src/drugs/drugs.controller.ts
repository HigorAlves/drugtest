import { Drug, Indication } from '@enterprise/domain'
import { extractIndicationsFromDailyMed } from '@enterprise/scraper'
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { IndicationMappingService } from '../indication-mapping/indication-mapping.service'
import { CreateIndicationDto } from '../indications/dto/create-indication.dto'
import { IndicationsService } from '../indications/indications.service'
import { DrugsService } from './drugs.service'
import { CreateDrugDto } from './dto/create-drug.dto'
import { UpdateDrugDto } from './dto/update-drug.dto'


@ApiTags('drugs')
@Controller('drugs')
export class DrugsController {
  constructor(
    private readonly drugsService: DrugsService,
    private readonly indicationsService: IndicationsService,
    private readonly indicationMappingService: IndicationMappingService
  ) {}

  @ApiOperation({ summary: 'Get all drugs' })
  @ApiResponse({ status: 200, description: 'Return all drugs', type: [Drug] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Drug[]> {
    return this.drugsService.findAll()
  }

  @ApiOperation({ summary: 'Get a drug by ID' })
  @ApiResponse({ status: 200, description: 'Return the drug', type: Drug })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Drug> {
    const drug = await this.drugsService.findOne(id)
    if (!drug) {
      throw new Error('Drug not found')
    }
    return drug
  }

  @ApiOperation({ summary: 'Create a new drug' })
  @ApiResponse({ status: 201, description: 'The drug has been created', type: Drug })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDrugDto: CreateDrugDto): Promise<Drug> {
    return this.drugsService.create(createDrugDto.name, createDrugDto.labelUrl)
  }

  @ApiOperation({ summary: 'Update a drug' })
  @ApiResponse({ status: 200, description: 'The drug has been updated', type: Drug })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto): Promise<Drug> {
    return this.drugsService.update(id, {
      name: updateDrugDto.name,
      labelUrl: updateDrugDto.labelUrl,
    })
  }

  @ApiOperation({ summary: 'Delete a drug' })
  @ApiResponse({ status: 200, description: 'The drug has been deleted' })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.drugsService.remove(id)
  }

  @ApiOperation({ summary: 'Get all indications for a drug' })
  @ApiResponse({ status: 200, description: 'Return all indications for the drug', type: [Indication] })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/indications')
  async findIndications(@Param('id') id: string): Promise<Indication[]> {
    // Check if drug exists
    const drug = await this.drugsService.findOne(id)
    if (!drug) {
      throw new Error('Drug not found')
    }
    return this.indicationsService.findByDrugId(id)
  }

  @ApiOperation({ summary: 'Create a new indication for a drug' })
  @ApiResponse({ status: 201, description: 'The indication has been created', type: Indication })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/indications')
  async createIndication(
    @Param('id') id: string,
    @Body() createIndicationDto: CreateIndicationDto
  ): Promise<Indication> {
    // Check if drug exists
    const drug = await this.drugsService.findOne(id)
    if (!drug) {
      throw new Error('Drug not found')
    }

    // Override drugId in DTO with the one from the URL
    return this.indicationsService.create(
      createIndicationDto.description,
      createIndicationDto.icd10Code,
      id,
      createIndicationDto.sourceText,
      createIndicationDto.mappingConfidence
    )
  }

  @ApiOperation({ summary: 'Scrape indications from DailyMed for a drug and map to ICD-10 codes' })
  @ApiResponse({ status: 200, description: 'Return the scraped and mapped indications', type: [Indication] })
  @ApiResponse({ status: 404, description: 'Drug not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/scrape-indications')
  async scrapeIndications(@Param('id') id: string): Promise<Indication[]> {
    // Check if drug exists
    const drug = await this.drugsService.findOne(id)
    if (!drug) {
      throw new Error('Drug not found')
    }

    // Scrape indications from DailyMed
    const scrapedIndications = await extractIndicationsFromDailyMed(drug.labelUrl)

    // Map indications to ICD-10 codes using AI
    const mappedIndications = await this.indicationMappingService.mapMultipleIndications(scrapedIndications)

    // Save each mapped indication to the database
    const savedIndications: Indication[] = []
    for (const mappedIndication of mappedIndications) {
      const indication = await this.indicationsService.create(
        mappedIndication.description,
        mappedIndication.icd10Code,
        id,
        mappedIndication.sourceText,
        mappedIndication.mappingConfidence
      )
      savedIndications.push(indication)
    }

    return savedIndications
  }
}
