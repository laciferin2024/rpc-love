import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
export type CsvRow = Record<string, any>;
export type ActionButton = { label: string; url: string };
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
    actionButtons: ActionButton[];
    isTrial: boolean;
    isStarred: boolean;
  };
};
type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any | null; // Replace 'any' with a proper GitHub user type later
};
type RpcFormState = {
  providers: CsvRow[];
  networkRpcs: CsvRow[];
  isLoading: boolean;
  error: string | null;
  formData: RpcFormData;
  currentStep: number;
  auth: AuthState;
};
type RpcFormActions = {
  fetchCsvData: () => Promise<void>;
  setFormData: (data: Partial<RpcFormData> | ((draft: RpcFormData) => void)) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  setAuth: (data: { accessToken: string; user: any }) => void;
  logout: () => void;
};
const initialFormData: RpcFormData = {
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
const initialAuthState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
};
export const useRpcFormStore = create<RpcFormState & RpcFormActions>()(
  devtools(
    persist(
      immer((set) => ({
        providers: [],
        networkRpcs: [],
        isLoading: true,
        error: null,
        formData: initialFormData,
        currentStep: 1,
        auth: initialAuthState,
        fetchCsvData: async () => {
          set({ isLoading: true, error: null });
          try {
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
        setFormData: (updater) =>
          set((state) => {
            if (typeof updater === 'function') {
              updater(state.formData);
            } else {
              // Deep merge for nested objects like 'network' and 'newProvider'
              state.formData = {
                ...state.formData,
                ...updater,
                newProvider: { ...state.formData.newProvider, ...updater.newProvider },
                network: { ...state.formData.network, ...updater.network },
              };
            }
          }),
        nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 2) })),
        prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
        goToStep: (step) => set({ currentStep: step }),
        reset: () => set((state) => {
          state.formData = initialFormData;
          state.currentStep = 1;
        }),
        setAuth: (data) =>
          set((state) => {
            state.auth.isAuthenticated = true;
            state.auth.accessToken = data.accessToken;
            state.auth.user = data.user;
          }),
        logout: () => set((state) => {
          state.auth = initialAuthState;
        }),
      })),
      {
        name: 'rpc-forge-storage',
        partialize: (state) => ({ auth: state.auth, formData: state.formData, currentStep: state.currentStep }),
      }
    )
  )
);