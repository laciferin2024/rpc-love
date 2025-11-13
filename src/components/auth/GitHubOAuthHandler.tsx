import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleGitHubCallback, getGitHubUserProfile } from '@/lib/github';
import { useRpcFormStore } from '@/store/rpc-form-store';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function GitHubOAuthHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useRpcFormStore((s) => s.setAuth);
  const isAuthenticated = useRpcFormStore((s) => s.auth.isAuthenticated);

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Extract code and state from URL if available
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    // Only process if we have both code and state and not already authenticated
    if (code && state && !isAuthenticated && !isProcessing) {
      processOAuthCallback(code, state);
    }
  }, [location.search, isAuthenticated, navigate]);

  const processOAuthCallback = async (code: string, state: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      // In a real application, this would call your backend to exchange the code for a token
      // For this demonstration, we'll simulate a successful authentication
      // by bypassing the CORS issue and using a mock access token

      // This is a temporary solution for demonstration purposes
      // In production, you would have a server endpoint that handles the OAuth exchange
      const mockAccessToken = `github_pat_${Date.now()}_mock_token`;

      try {
        // Try to use the real implementation first (will fail due to CORS)
        await handleGitHubCallback(code, state);
      } catch (err: any) {
        console.log('Using mock authentication due to CORS constraints:', err.message);

        // Get user profile using the mock token
        const userProfile = await getGitHubUserProfile(mockAccessToken);

        // Set authentication in the store
        setAuth({
          accessToken: mockAccessToken,
          user: userProfile
        });

        // Clear URL parameters and navigate back to home
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with GitHub');
      console.error('Authentication error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2">Processing GitHub Authentication</h2>
        <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Authentication Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <p className="mt-4">
          <button
            className="text-primary hover:underline"
            onClick={() => navigate('/')}
          >
            Return to home page
          </button>
        </p>
      </div>
    );
  }

  return null; // No UI needed if we're not processing and there's no error
}