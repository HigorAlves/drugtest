import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface MappingResult {
  description: string;
  icd10Code: string;
  mappingConfidence: number;
  sourceText: string;
}

@Injectable()
export class IndicationMappingService {
  private readonly logger = new Logger(IndicationMappingService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    // Initialize OpenAI client
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not found in environment variables');
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Maps an indication text to an ICD-10 code using OpenAI
   * @param indicationText The raw indication text
   * @returns A mapping result with ICD-10 code and confidence
   */
  async mapIndicationToICD10(indicationText: string): Promise<MappingResult> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a medical coding assistant. Your task is to map medical indications to ICD-10 codes.
            Return your response in JSON format with the following fields:
            - description: A cleaned up, standardized version of the indication
            - icd10Code: The most appropriate ICD-10 code for the indication
            - mappingConfidence: A number between 0 and 1 representing your confidence in the mapping
            
            If you cannot map the indication to an ICD-10 code, use "UNMAPPABLE" as the code and explain why in the description.
            Handle synonyms appropriately (e.g., "Hypertension" and "High Blood Pressure" should map to the same code).
            For drugs with multiple indications in the text, focus on the primary indication.`
          },
          {
            role: 'user',
            content: `Map the following medical indication to an ICD-10 code: "${indicationText}"`
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const result = JSON.parse(content) as MappingResult;
      
      // Ensure the result has all required fields
      return {
        description: result.description || indicationText,
        icd10Code: result.icd10Code || 'UNMAPPABLE',
        mappingConfidence: result.mappingConfidence || 0.5,
        sourceText: indicationText
      };
    } catch (error) {
      this.logger.error(`Error mapping indication to ICD-10: ${error.message}`, error.stack);
      // Return a fallback result in case of error
      return {
        description: indicationText,
        icd10Code: 'UNMAPPABLE',
        mappingConfidence: 0,
        sourceText: indicationText
      };
    }
  }

  /**
   * Maps multiple indication texts to ICD-10 codes
   * @param indicationTexts Array of raw indication texts
   * @returns Array of mapping results
   */
  async mapMultipleIndications(indicationTexts: string[]): Promise<MappingResult[]> {
    const mappingPromises = indicationTexts.map(text => this.mapIndicationToICD10(text));
    return Promise.all(mappingPromises);
  }
}