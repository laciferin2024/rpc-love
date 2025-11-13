import { Octokit } from 'octokit';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI = window.location.origin;
export const signInWithGitHub = () => {
  if (!GITHUB_CLIENT_ID) {
    console.error("VITE_GITHUB_CLIENT_ID is not set. Cannot initiate GitHub login.");
    alert("GitHub authentication is not configured. Please contact the site administrator.");
    return;
  }
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem('gh_oauth_state', state);
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'repo,user',
    state: state,
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
};
// This function would typically be a serverless function to avoid exposing client secrets
// and to handle CORS. For this frontend-only app, we're assuming a public client
// setup that requires a proxy, which is outside the scope of this implementation.
// A common pattern is to use a service like https://github.com/prose/gatekeeper
// or a simple Cloudflare Worker as a proxy.
export const handleGitHubCallback = async (code: string, state: string) => {
  const savedState = localStorage.getItem('gh_oauth_state');
  if (state !== savedState) {
    throw new Error('Invalid state parameter. Please try signing in again.');
  }
  localStorage.removeItem('gh_oauth_state');
  // This is the part that will fail due to CORS without a proxy.
  // This is a known limitation of the "frontend-only" requirement.
  // In a real application, this request would be made from a server-side proxy.
  console.error(
    'CORS_ERROR: The following request will fail due to browser security (CORS). ' +
    'A server-side proxy is required to exchange the code for an access token. ' +
    'See comments in src/lib/github.ts for details.'
  );
  // We cannot implement this part without a backend proxy.
  // This will throw an error, which will be caught in the UI to inform the user.
  // To test the UI flow, you can temporarily return a mock token here.
  // e.g., return "gho_your_test_token";
  throw new Error('Token exchange failed due to CORS. A server-side proxy is required.');
};
export const getGitHubUserProfile = async (token: string) => {
  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.rest.users.getAuthenticated();
  return user;
};