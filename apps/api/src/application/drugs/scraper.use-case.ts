import puppeteer from 'puppeteer'

export async function extractIndicationsFromDailyMed(
	url: string
): Promise<{ indication: string; description: string }[]> {
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()

	try {
		await page.goto(url, { waitUntil: 'networkidle2' })

		await page.waitForSelector('h1.Highlights span')

		const data = await page.evaluate(() => {
			// 1️⃣ Find the INDICATIONS AND USAGE header
			const header = [...document.querySelectorAll('h1.Highlights span')].find((s) =>
				s.textContent?.toUpperCase().includes('INDICATIONS AND USAGE')
			)

			if (!header) return []

			// 2️⃣ Get the parent HighlightSection div
			const sectionDiv = header.closest('.HighlightSection')
			if (!sectionDiv) return []

			// 3️⃣ Find all span.Underline inside that section
			const spans = Array.from(sectionDiv.querySelectorAll('span.Underline'))

			// 4️⃣ Map each to indication + description
			const result = spans.map((span) => {
				const indication = span.textContent?.trim() ?? ''

				// Find next sibling paragraph
				let description = ''
				let next = span.parentElement?.nextElementSibling

				while (next && next.tagName !== 'P') {
					next = next.nextElementSibling
				}

				if (next && next.tagName === 'P') {
					description = next.textContent?.trim() ?? ''
				}

				return { indication, description }
			})

			return result
		})

		await browser.close()
		return data
	} catch (err) {
		await browser.close()
		console.error(err)
		throw err
	}
}
