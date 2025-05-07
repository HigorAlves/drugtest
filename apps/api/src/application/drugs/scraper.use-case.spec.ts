import * as scraperModule from './scraper.use-case';

// Mock the extractIndicationsFromDailyMed function
jest.spyOn(scraperModule, 'extractIndicationsFromDailyMed').mockImplementation(async (url) => {
  if (url.includes('error')) {
    throw new Error('Navigation failed');
  }
  return [
    { indication: 'Hypertension', description: 'For the treatment of hypertension' },
    { indication: 'Heart Failure', description: 'For the treatment of heart failure' },
  ];
});

describe('extractIndicationsFromDailyMed', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should extract indications and descriptions from DailyMed', async () => {
    // Arrange
    const url = 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=123';
    const expectedData = [
      { indication: 'Hypertension', description: 'For the treatment of hypertension' },
      { indication: 'Heart Failure', description: 'For the treatment of heart failure' },
    ];

    // Act
    const result = await scraperModule.extractIndicationsFromDailyMed(url);

    // Assert
    expect(result).toEqual(expectedData);
    expect(scraperModule.extractIndicationsFromDailyMed).toHaveBeenCalledWith(url);
  });

  it('should handle errors', async () => {
    // Arrange
    const url = 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=error';

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act & Assert
    await expect(scraperModule.extractIndicationsFromDailyMed(url)).rejects.toThrow('Navigation failed');
    expect(scraperModule.extractIndicationsFromDailyMed).toHaveBeenCalledWith(url);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
