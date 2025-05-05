const fetch = require('node-fetch');

// Replace these values with your actual API endpoint and authentication token
const API_URL = 'http://localhost:3000';
const AUTH_TOKEN = 'your_auth_token_here';

// Create a drug with a valid DailyMed URL
async function createDrug() {
  const response = await fetch(`${API_URL}/drugs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify({
      name: 'Test Drug',
      labelUrl: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1a0be57b-537f-435d-bb3d-dcd265fc4e74'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create drug: ${response.statusText}`);
  }

  return await response.json();
}

// Scrape indications for a drug
async function scrapeIndications(drugId) {
  const response = await fetch(`${API_URL}/drugs/${drugId}/scrape-indications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to scrape indications: ${response.statusText}`);
  }

  return await response.json();
}

// Main function
async function main() {
  try {
    console.log('Creating a drug...');
    const drug = await createDrug();
    console.log('Drug created:', drug);

    console.log('Scraping indications...');
    const indications = await scrapeIndications(drug.id);
    console.log('Indications scraped:', indications);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();