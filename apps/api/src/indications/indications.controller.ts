import { Indication } from '@enterprise/domain'
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateIndicationDto } from './dto/create-indication.dto'
import { UpdateIndicationDto } from './dto/update-indication.dto'
import { IndicationsService } from './indications.service'

@ApiTags('indications')
@Controller('indications')
export class IndicationsController {
  constructor(private readonly indicationsService: IndicationsService) {}

  @ApiOperation({ summary: 'Get all indications' })
  @ApiResponse({ status: 200, description: 'Return all indications', type: [Indication] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Indication[]> {
    return this.indicationsService.findAll()
  }

  @ApiOperation({ summary: 'Get an indication by ID' })
  @ApiResponse({ status: 200, description: 'Return the indication', type: Indication })
  @ApiResponse({ status: 404, description: 'Indication not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Indication> {
    const indication = await this.indicationsService.findOne(id)
    if (!indication) {
      throw new Error('Indication not found')
    }
    return indication
  }

  @ApiOperation({ summary: 'Create a new indication' })
  @ApiResponse({ status: 201, description: 'The indication has been created', type: Indication })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createIndicationDto: CreateIndicationDto): Promise<Indication> {
    return this.indicationsService.create(
      createIndicationDto.description,
      createIndicationDto.icd10Code,
      createIndicationDto.drugId,
      createIndicationDto.sourceText,
      createIndicationDto.mappingConfidence
    )
  }

  @ApiOperation({ summary: 'Update an indication' })
  @ApiResponse({ status: 200, description: 'The indication has been updated', type: Indication })
  @ApiResponse({ status: 404, description: 'Indication not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateIndicationDto: UpdateIndicationDto): Promise<Indication> {
    return this.indicationsService.update(id, {
      description: updateIndicationDto.description,
      icd10Code: updateIndicationDto.icd10Code,
      drugId: updateIndicationDto.drugId,
      sourceText: updateIndicationDto.sourceText,
      mappingConfidence: updateIndicationDto.mappingConfidence,
    })
  }

  @ApiOperation({ summary: 'Delete an indication' })
  @ApiResponse({ status: 200, description: 'The indication has been deleted' })
  @ApiResponse({ status: 404, description: 'Indication not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.indicationsService.remove(id)
  }
}