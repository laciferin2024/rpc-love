import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
// Using a generic Record<string, any> for now as columns can vary.
// We can define a stricter type later if needed.
export type CsvRow = Record<string, any>;
export type RpcFormData = {
  providerType: 'existing' | 'new';
  existingProviderSlug: string | null;
  newProvider: {
    name: string;
    slug: string;
  };
  network: {
    slug: string;
    plan: string;
    nodeType: string;
    chain: 'mainnet' | 'calibnet';
    accessPrice: string;
    queryPrice: string;
    availableApis: string[];
    actionButtons: { label: string; url: string }[];
    isTrial: boolean;
    isStarred: boolean;
  };
};
type RpcFormState = {
  providers: CsvRow[];
  networkRpcs: CsvRow[];
  isLoading: boolean;
  error: string | null;
  formData: RpcFormData;
  currentStep: number;
};
type RpcFormActions = {
  fetchCsvData: () => Promise<void>;
  setFormData: (data: Partial<RpcFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
};
const initialState: RpcFormData = {
  providerType: 'existing',
  existingProviderSlug: null,
  newProvider: {
    name: '',
    slug: '',
  },
  network: {
    slug: '',
    plan: '',
    nodeType: '',
    chain: 'mainnet',
    accessPrice: '',
    queryPrice: '',
    availableApis: [],
    actionButtons: [{ label: '', url: '' }],
    isTrial: false,
    isStarred: false,
  },
};
export const useRpcFormStore = create<RpcFormState & RpcFormActions>()(
  immer((set) => ({
    providers: [],
    networkRpcs: [],
    isLoading: true,
    error: null,
    formData: initialState,
    currentStep: 1,
    fetchCsvData: async () => {
      set({ isLoading: true, error: null });
      try {
        // This logic will be moved to a dedicated lib file
        const { fetchAndParseCsv } = await import('@/lib/csv');
        const [providersData, networkRpcsData] = await Promise.all([
          fetchAndParseCsv('https://raw.githubusercontent.com/Chain-Love/chain-love/refs/heads/main/providers/rpc.csv'),
          fetchAndParseCsv('https://raw.githubusercontent.com/Chain-Love/chain-love/refs/heads/main/networks/filecoin/rpc.csv'),
        ]);
        set((state) => {
          state.providers = providersData;
          state.networkRpcs = networkRpcsData;
          state.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch CSV data';
        set({ error: errorMessage, isLoading: false });
        console.error(errorMessage);
      }
    },
    setFormData: (data) =>
      set((state) => {
        state.formData = { ...state.formData, ...data };
      }),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    goToStep: (step) => set({ currentStep: step }),
    reset: () => set({ formData: initialState, currentStep: 1 }),
  }))
);