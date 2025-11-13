import { RpcFormData } from "@/store/rpc-form-store";

/**
 * Returns dummy form values for development/testing purposes.
 * These values are designed to pass validation and provide realistic test data.
 */
export function getDummyFormValues(): RpcFormData {
  return {
    providerType: 'new',
    existingProviderSlug: '',
    newProvider: {
      name: 'Dev Test RPC Provider',
      slug: 'dev-test-rpc',
    },
    network: {
      slug: 'dev-test-rpc-free-tier',
      plan: 'Free',
      nodeType: 'Recent-State',
      chain: 'mainnet',
      accessPrice: '$0/month',
      queryPrice: '$0.01/1k queries',
      availableApis: ['JSON-RPC', 'GraphQL', 'REST'],
      actionButtons: [
        {
          label: 'Sign Up',
          url: 'https://example.com/signup',
        },
        {
          label: 'Documentation',
          url: 'https://example.com/docs',
        },
      ],
      isTrial: true,
      isStarred: false,
    },
  };
}

/**
 * Returns dummy form values for an existing provider scenario.
 */
export function getDummyFormValuesExistingProvider(): RpcFormData {
  return {
    providerType: 'existing',
    existingProviderSlug: '', // Will be set based on available providers
    newProvider: {
      name: '',
      slug: '',
    },
    network: {
      slug: 'existing-provider-free-tier',
      plan: 'Pay-as-you-go',
      nodeType: 'Archive',
      chain: 'calibnet',
      accessPrice: '$10/month',
      queryPrice: '$0.05/1k queries',
      availableApis: ['JSON-RPC', 'WebSocket'],
      actionButtons: [
        {
          label: 'Get Started',
          url: 'https://example.com/get-started',
        },
      ],
      isTrial: false,
      isStarred: true,
    },
  };
}

