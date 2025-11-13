import Papa from 'papaparse';
import { CsvRow } from '@/store/rpc-form-store';
/**
 * Fetches a CSV file from a URL and parses it into an array of objects.
 * @param url The URL of the CSV file.
 * @returns A promise that resolves to an array of CsvRow objects.
 */
export async function fetchAndParseCsv(url: string): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error('CSV Parsing Errors:', results.errors);
          reject(new Error(`Failed to parse CSV from ${url}. Check console for details.`));
        } else {
          resolve(results.data as CsvRow[]);
        }
      },
      error: (error: Error) => {
        console.error('CSV Fetch Error:', error);
        reject(new Error(`Failed to fetch CSV from ${url}: ${error.message}`));
      },
    });
  });
}