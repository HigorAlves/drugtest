import puppeteer from 'puppeteer';

/**
 * Extracts the "Indications and Usage" section from a drug's DailyMed page
 * @param url The URL of the drug's DailyMed page
 * @returns An array of indications, one per line/sentence
 */
export async function extractIndicationsFromDailyMed(url: string): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the section to appear
    // We'll look for h2 elements with specific text content
    const indicationTexts = [
      'INDICATIONS AND USAGE',
      'Indications and Usage',
      'INDICATIONS',
      'Indications'
    ];

    // Wait for h2 elements to be present on the page
    await page.waitForSelector('h2', { timeout: 5000 });

    // Get the text content of the section
    const rawText = await page.evaluate((indicationTexts) => {
      // Find all h2 elements
      const headings = Array.from(document.querySelectorAll('h2'));

      // Find the first heading that matches one of our target texts
      const heading = headings.find(h => {
        const text = h.textContent || '';
        return indicationTexts.some(target => text.includes(target));
      });

      if (!heading) return '';

      // Find the content div that follows the heading
      const contentElement = heading.nextElementSibling;

      // Sometimes the content is in a div following the heading
      if (contentElement && 
         (contentElement.tagName === 'DIV' || 
          contentElement.tagName === 'P' || 
          contentElement.tagName === 'UL')) {
        return contentElement.textContent || '';
      }

      // If we couldn't find a suitable next element, try to get the parent's content
      const parent = heading.parentElement;
      if (parent) {
        // Get all text nodes after the heading within the parent
        const textContent = Array.from(parent.childNodes)
          .filter(node => {
            // Get nodes that come after the heading
            let currentNode = node as any;
            while (currentNode && currentNode !== heading) {
              currentNode = currentNode.previousSibling;
            }
            return currentNode === heading;
          })
          .map(node => node.textContent || '')
          .join('\n');

        return textContent;
      }

      return '';
    }, indicationTexts);

    // If we couldn't find any content, return an empty array
    if (!rawText) {
      await browser.close();
      return [];
    }

    // Clean and split the text into indications
    const indications = rawText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      // Remove HTML tags
      .map(line => line.replace(/<[^>]*>/g, ''))
      // Remove footnotes and references (typically in brackets or parentheses)
      .map(line => line.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, ''))
      .map(line => line.trim())
      .filter(line => line.length > 0);

    await browser.close();
    return indications;
  } catch (err) {
    await browser.close();
    throw err;
  }
}
