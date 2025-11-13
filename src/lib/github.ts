import { Octokit } from 'octokit';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
const REDIRECT_URI = window.location.origin;
const UPSTREAM_OWNER = 'Chain-Love';
const UPSTREAM_REPO = 'chain-love';

// Security warning: Client secrets should NOT be exposed in browser code for production SPAs.
// Only use this if you're using a backend proxy that handles the secret securely.
// For true frontend-only SPAs, use PKCE without a client secret.
if (GITHUB_CLIENT_SECRET && typeof window !== 'undefined') {
  console.warn(
    '⚠️ SECURITY WARNING: VITE_GITHUB_CLIENT_SECRET is exposed in the browser bundle. ' +
    'This is a security risk. For production, use PKCE without a client secret, ' +
    'or handle the secret on a backend server.'
  );
}

// CORS proxy URL - defaults to a public proxy if not configured
// For production, users should set up their own CORS proxy
const CORS_PROXY_URL = import.meta.env.VITE_CORS_PROXY_URL || 'https://corsproxy.io/?';

// PKCE Helper Functions
/**
 * Generates a random code verifier for PKCE (43-128 characters, URL-safe)
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  // Convert to base64url (URL-safe base64)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generates a code challenge from a code verifier using SHA256 and base64url encoding
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  // Convert to base64url
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
export const signInWithGitHub = async () => {
  if (!GITHUB_CLIENT_ID) {
    console.error("VITE_GITHUB_CLIENT_ID is not set. Cannot initiate GitHub login.");
    alert("GitHub authentication is not configured. Please contact the site administrator.");
    return;
  }

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = Math.random().toString(36).substring(7);

  // Store code_verifier and state in sessionStorage (more secure than localStorage)
  sessionStorage.setItem('gh_oauth_state', state);
  sessionStorage.setItem('gh_oauth_code_verifier', codeVerifier);

  // Build OAuth URL with PKCE parameters
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'repo,user',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
};
export const handleGitHubCallback = async (code: string, state: string): Promise<string> => {
  // Verify state parameter
  const savedState = sessionStorage.getItem('gh_oauth_state');
  if (state !== savedState) {
    sessionStorage.removeItem('gh_oauth_state');
    sessionStorage.removeItem('gh_oauth_code_verifier');
    throw new Error('Invalid state parameter. The authentication session may have expired. Please try signing in again.');
  }

  // Retrieve code_verifier
  const codeVerifier = sessionStorage.getItem('gh_oauth_code_verifier');
  if (!codeVerifier) {
    sessionStorage.removeItem('gh_oauth_state');
    throw new Error('Code verifier not found. The authentication session may have expired. Please try signing in again.');
  }

  // Clean up session storage
  sessionStorage.removeItem('gh_oauth_state');
  sessionStorage.removeItem('gh_oauth_code_verifier');

  try {
    // Exchange code for access token using CORS proxy
    const tokenUrl = 'https://github.com/login/oauth/access_token';
    const tokenParams = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    // Include client_secret if provided (not recommended for SPAs - see security warning above)
    if (GITHUB_CLIENT_SECRET) {
      tokenParams.append('client_secret', GITHUB_CLIENT_SECRET);
    }

    // Use CORS proxy to make the request
    const proxyUrl = CORS_PROXY_URL.endsWith('?') 
      ? `${CORS_PROXY_URL}${encodeURIComponent(tokenUrl)}`
      : `${CORS_PROXY_URL}${tokenUrl}`;

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenParams.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    // Handle error response from GitHub
    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      throw new Error('No access token received from GitHub. Please try signing in again.');
    }

    return data.access_token;
  } catch (error: any) {
    // Provide user-friendly error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Network error: Could not connect to GitHub. Please check your internet connection and try again. If the problem persists, the CORS proxy may be unavailable.');
    }
    if (error.message.includes('CORS')) {
      throw new Error('CORS error: The CORS proxy is not responding. Please configure a valid CORS proxy URL or set up your own proxy server.');
    }
    throw error;
  }
};
export const getGitHubUserProfile = async (token: string) => {
  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.rest.users.getAuthenticated();
  return user;
};
/**
 * Encodes a UTF-8 string to base64, properly handling Unicode characters.
 * The native btoa() function only works with Latin1, so we need to encode to UTF-8 bytes first.
 */
function utf8ToBase64(str: string): string {
  // Convert UTF-8 string to bytes using TextEncoder
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  
  // Convert bytes to binary string and then to base64
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// --- GitHub API Actions ---
export const getOrCreateFork = async (octokit: Octokit) => {
  try {
    const { data: fork } = await octokit.rest.repos.createFork({
      owner: UPSTREAM_OWNER,
      repo: UPSTREAM_REPO,
    });
    // Wait a moment for the fork to be fully created
    await new Promise(resolve => setTimeout(resolve, 3000));
    return fork;
  } catch (error: any) {
    // If fork already exists, error code is 422
    if (error.status === 422) {
      const { data: user } = await octokit.rest.users.getAuthenticated();
      const { data: repo } = await octokit.rest.repos.get({ owner: user.login, repo: UPSTREAM_REPO });
      return repo;
    }
    console.error("Error creating or getting fork:", error);
    throw new Error("Could not create or find your fork of the repository.");
  }
};
export const createBranch = async (octokit: Octokit, owner: string, repo: string, branchName: string) => {
  const { data: mainBranch } = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch: 'main',
  });
  const mainSha = mainBranch.commit.sha;
  const { data: newRef } = await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: mainSha,
  });
  return newRef;
};
export const getFileContent = async (octokit: Octokit, owner: string, repo: string, path: string, branch: string) => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    if (Array.isArray(data) || !('content' in data)) {
      throw new Error(`Could not retrieve file content for ${path}. It might be a directory.`);
    }
    return { content: atob(data.content), sha: data.sha };
  } catch (error: any) {
    if (error.status === 404) {
      return { content: null, sha: null }; // File doesn't exist
    }
    throw error;
  }
};
export const updateFile = async (octokit: Octokit, owner: string, repo: string, path: string, content: string, message: string, branch: string, sha: string | null) => {
  return await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: utf8ToBase64(content), // Base64 encode content (UTF-8 safe)
    branch,
    sha: sha || undefined, // Provide SHA if updating, otherwise it's a new file
  });
};
export const createPullRequest = async (octokit: Octokit, owner: string, repo: string, head: string, base: string, title: string, body: string) => {
  const { data: pr } = await octokit.rest.pulls.create({
    owner: UPSTREAM_OWNER,
    repo: UPSTREAM_REPO,
    head: `${owner}:${head}`,
    base,
    title,
    body,
  });
  return pr;
};