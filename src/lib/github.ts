import { Octokit } from 'octokit';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI = window.location.origin;
const UPSTREAM_OWNER = 'Chain-Love';
const UPSTREAM_REPO = 'chain-love';
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
export const handleGitHubCallback = async (code: string, state: string) => {
  const savedState = localStorage.getItem('gh_oauth_state');
  if (state !== savedState) {
    throw new Error('Invalid state parameter. Please try signing in again.');
  }
  localStorage.removeItem('gh_oauth_state');
  console.error(
    'CORS_ERROR: The following request will fail due to browser security (CORS). ' +
    'A server-side proxy is required to exchange the code for an access token. ' +
    'See comments in src/lib/github.ts for details.'
  );
  // MOCKING: In a real app, this would be a call to a backend proxy.
  // To allow UI flow testing, we'll throw an error that suggests a mock token.
  throw new Error('Token exchange failed due to CORS. A server-side proxy is required. You can test the flow by manually creating a fine-grained personal access token with repo permissions and pasting it into the Zustand devtools for the `accessToken` field.');
};
export const getGitHubUserProfile = async (token: string) => {
  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.rest.users.getAuthenticated();
  return user;
};
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
    content: btoa(content), // Base64 encode content
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