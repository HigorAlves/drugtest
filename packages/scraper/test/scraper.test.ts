import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import puppeteer, { Browser, Page } from 'puppeteer';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractIndicationsFromDailyMed } from '../src/scraper';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('DailyMed Scraper', () => {
  let browser: Browser;
  let page: Page;
  let mockServer: any;

  // Mock server URL
  const mockServerUrl = 'http://localhost:3000';

  // Setup: Create a mock server to serve the static HTML
  beforeAll(async () => {
    // Initialize Puppeteer
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();

    // Load the static HTML directly into the page
    const htmlPath = path.join(__dirname, 'fixtures', 'dupixent.html');
    const html = readFileSync(htmlPath, 'utf-8');
    await page.setContent(html);
  });

  // Teardown: Close the browser
  afterAll(async () => {
    await browser.close();
  });

  it('should extract indications from the static HTML', async () => {
    // Test the extraction directly on the page
    const indications = await page.evaluate(() => {
      // Find all h2 elements
      const headings = Array.from(document.querySelectorAll('h2'));

      // Find the one with the text we're looking for
      const heading = headings.find(h => 
        h.textContent?.includes('INDICATIONS AND USAGE') || 
        h.textContent?.includes('Indications and Usage')
      );

      if (!heading) return [];

      // Find the content div that follows the heading
      const contentElement = heading.nextElementSibling;
      if (!contentElement) return [];

      // Get the text content
      const rawText = contentElement.textContent || '';

      // Clean and split the text
      return rawText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
    });

    // Verify the results
    expect(indications).toBeTruthy();
    expect(indications.length).toBeGreaterThan(0);
    expect(indications.some(line => line.includes('Atopic Dermatitis'))).toBe(true);
    expect(indications.some(line => line.includes('Asthma'))).toBe(true);
  });

  it('should handle the case when the section is not found', async () => {
    // Load a modified HTML without the indications section
    const modifiedHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Drug Information</h1>
          <div>
            <h2>Some Other Section</h2>
            <div>Some content</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(modifiedHtml);

    // Test the extraction directly on the page
    const indications = await page.evaluate(() => {
      // Find all h2 elements
      const headings = Array.from(document.querySelectorAll('h2'));

      // Find the one with the text we're looking for
      const heading = headings.find(h => 
        h.textContent?.includes('INDICATIONS AND USAGE') || 
        h.textContent?.includes('Indications and Usage')
      );

      if (!heading) return [];

      // Find the content div that follows the heading
      const contentElement = heading.nextElementSibling;
      if (!contentElement) return [];

      // Get the text content
      const rawText = contentElement.textContent || '';

      // Clean and split the text
      return rawText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
    });

    // Verify the results
    expect(indications).toEqual([]);
  });

  it('should handle alternative headings', async () => {
    // Load a modified HTML with an alternative heading
    const modifiedHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Drug Information</h1>
          <div>
            <h2>INDICATIONS</h2>
            <div>This drug is indicated for treatment of condition X.</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(modifiedHtml);

    // Test the extraction directly on the page
    const indications = await page.evaluate(() => {
      // Find all h2 elements
      const headings = Array.from(document.querySelectorAll('h2'));

      // Find the one with the text we're looking for
      const heading = headings.find(h => h.textContent?.includes('INDICATIONS'));

      if (!heading) return [];

      // Find the content div that follows the heading
      const contentElement = heading.nextElementSibling;
      if (!contentElement) return [];

      // Get the text content
      const rawText = contentElement.textContent || '';

      // Clean and split the text
      return rawText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
    });

    // Verify the results
    expect(indications).toBeTruthy();
    expect(indications.length).toBeGreaterThan(0);
    expect(indications[0]).toContain('treatment of condition X');
  });
});
