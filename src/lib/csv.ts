import Papa from 'papaparse';
import { CsvRow, RpcFormData } from '@/store/rpc-form-store';
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
/**
 * Prepares updated CSV strings based on form data.
 */
export function prepareCsvUpdates(formData: RpcFormData, originalProviders: CsvRow[], originalNetworkRpcs: CsvRow[]) {
  let providerChanges = false;
  let networkChanges = false;
  // --- Providers CSV ---
  const updatedProviders = [...originalProviders];
  if (formData.providerType === 'new') {
    const existingProvider = updatedProviders.find(p => p.slug === formData.newProvider.slug);
    if (!existingProvider) {
      updatedProviders.push({
        slug: formData.newProvider.slug,
        provider: formData.newProvider.name,
        website: '', // Default empty values for new providers
        twitter: '',
        github: '',
      });
      providerChanges = true;
    }
  }
  // --- Network RPCs CSV ---
  const updatedNetworkRpcs = [...originalNetworkRpcs];
  const providerSlug = formData.providerType === 'existing' ? formData.existingProviderSlug : formData.newProvider.slug;
  const newNetworkRow = {
    slug: formData.network.slug,
    provider: providerSlug,
    plan: formData.network.plan,
    nodeType: formData.network.nodeType,
    chain: formData.network.chain,
    accessPrice: formData.network.accessPrice,
    queryPrice: formData.network.queryPrice,
    availableApis: JSON.stringify(formData.network.availableApis),
    actionButtons: JSON.stringify(formData.network.actionButtons.filter(b => b.label && b.url)),
    trial: formData.network.isTrial ? 'TRUE' : 'FALSE',
    starred: formData.network.isStarred ? 'TRUE' : 'FALSE',
  };
  const existingIndex = updatedNetworkRpcs.findIndex(r => r.slug === formData.network.slug);
  if (existingIndex > -1) {
    // Preserve other columns by merging
    updatedNetworkRpcs[existingIndex] = { ...updatedNetworkRpcs[existingIndex], ...newNetworkRow };
  } else {
    updatedNetworkRpcs.push(newNetworkRow);
  }
  networkChanges = true;
  // --- Serialize to strings ---
  const providerHeaders = originalProviders.length > 0 ? Object.keys(originalProviders[0]) : ['slug', 'provider', 'website', 'twitter', 'github'];
  const networkHeaders = originalNetworkRpcs.length > 0 ? Object.keys(originalNetworkRpcs[0]) : Object.keys(newNetworkRow);
  const providersCsv = Papa.unparse(updatedProviders, { header: true, columns: providerHeaders });
  const networkRpcsCsv = Papa.unparse(updatedNetworkRpcs, { header: true, columns: networkHeaders });
  return {
    providersCsv,
    networkRpcsCsv,
    providerChanges,
    networkChanges,
  };
}