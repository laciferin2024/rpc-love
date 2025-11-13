import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { CsvPreviewTable } from '@/components/rpc/CsvPreviewTable';
import { useRpcFormStore } from '@/store/rpc-form-store';
import { PlusCircle } from 'lucide-react';
export function HomePage() {
  const fetchCsvData = useRpcFormStore((s) => s.fetchCsvData);
  const providers = useRpcFormStore((s) => s.providers);
  const networkRpcs = useRpcFormStore((s) => s.networkRpcs);
  const isLoading = useRpcFormStore((s) => s.isLoading);
  const error = useRpcFormStore((s) => s.error);
  useEffect(() => {
    // Fetch data only if it hasn't been fetched yet and we are not already loading
    if (providers.length === 0 && networkRpcs.length === 0 && !isLoading) {
      fetchCsvData();
    }
  }, [fetchCsvData, providers.length, networkRpcs.length, isLoading]);
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold font-display">Chain.Love RPC Submitter</h1>
                <p className="text-muted-foreground text-lg">
                  View current RPCs or add a new one to the registry.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/add">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add RPC
                </Link>
              </Button>
            </div>
            <div className="space-y-8">
              <CsvPreviewTable
                title="Current Filecoin RPC Entries"
                data={networkRpcs}
                isLoading={isLoading}
                error={error}
                columnsToShow={['slug', 'provider', 'chain', 'plan', 'nodeType']}
              />
              <CsvPreviewTable
                title="Registered RPC Providers"
                data={providers}
                isLoading={isLoading}
                error={error}
                columnsToShow={['slug', 'provider', 'website']}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
    </div>
  );
}