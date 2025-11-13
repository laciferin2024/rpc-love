# GitHub OAuth Authentication

This document explains how the GitHub OAuth authentication flow works in the RPC Love application.

## Overview

The application implements GitHub OAuth with PKCE (Proof Key for Code Exchange) for user authentication, allowing users to sign in with their GitHub accounts to submit RPCs and make pull requests to the Chain Love repository. This implementation works entirely in the browser without requiring a backend server.

## How It Works

1. **Authentication Initialization**:
   - When a user clicks "Sign in with GitHub" in the AppHeader component, the `signInWithGitHub()` function is called
   - The function generates PKCE parameters:
     - A random `code_verifier` (43-128 characters, URL-safe)
     - A `code_challenge` (SHA256 hash of the verifier, base64url encoded)
   - A random `state` value is generated for CSRF protection
   - Both `code_verifier` and `state` are stored in `sessionStorage` (more secure than localStorage)
   - The user is redirected to GitHub's authorization page with OAuth parameters including the `code_challenge` and `code_challenge_method=S256`

2. **OAuth Callback Handling**:
   - After GitHub authorization, the user is redirected back to our application with `code` and `state` URL parameters
   - The AppHeader component automatically detects these parameters and processes them
   - The URL is immediately cleaned up (parameters removed) to prevent repeated processing

3. **Token Exchange**:
   - The `handleGitHubCallback()` function verifies the `state` parameter matches the stored value
   - It retrieves the `code_verifier` from sessionStorage
   - Since GitHub's token endpoint doesn't support CORS, the application uses a CORS proxy to exchange the authorization code for an access token
   - The token exchange includes: `client_id`, `code`, `redirect_uri`, `code_verifier`, and `code_challenge_method`
   - Upon success, the access token is returned

4. **User Profile Retrieval**:
   - The access token is used to fetch the user's GitHub profile via the GitHub API
   - User information is stored in the application's state

5. **User Session**:
   - After successful authentication, the user's information is stored in the application's state
   - This includes an access token and user profile information
   - The UI updates to show the user's avatar and name in the header

## PKCE Flow Details

PKCE (Proof Key for Code Exchange) is a security extension for OAuth 2.0 that is particularly important for public clients (like SPAs) that cannot securely store a client secret. The flow works as follows:

1. **Code Verifier**: A cryptographically random string (43-128 characters) using URL-safe characters
2. **Code Challenge**: A SHA256 hash of the code verifier, base64url encoded
3. **Authorization Request**: Includes the code challenge and method (S256)
4. **Token Exchange**: Includes the original code verifier, which GitHub verifies against the challenge

This ensures that even if the authorization code is intercepted, it cannot be exchanged for a token without the code verifier.

## CORS Proxy

Since GitHub's OAuth token endpoint (`https://github.com/login/oauth/access_token`) doesn't support CORS, the application uses a CORS proxy to make the token exchange request from the browser.

### Configuration

You can configure a custom CORS proxy by setting the `VITE_CORS_PROXY_URL` environment variable:

```env
VITE_CORS_PROXY_URL="https://your-cors-proxy.com/"
```

If not set, the application defaults to a public CORS proxy service. **For production use, you should set up your own CORS proxy** for better security and reliability.

### Proxy URL Format

The proxy URL should either:
- End with `?` (e.g., `https://corsproxy.io/?`) - the target URL will be URL-encoded as a query parameter
- End with `/` (e.g., `https://your-proxy.com/`) - the target URL will be appended directly

## Implementation Details

The primary implementation can be found in:

- **src/components/layout/AppHeader.tsx**: Contains the authentication flow logic and callback handling
- **src/lib/github.ts**: Provides GitHub API integration functions including PKCE helpers and token exchange
- **src/store/rpc-form-store.ts**: Manages authentication state

## Error Handling

The application provides user-friendly error messages for common scenarios:

- **Invalid state parameter**: The authentication session may have expired
- **Missing code verifier**: The session storage was cleared or expired
- **Network errors**: Connection issues or CORS proxy unavailability
- **GitHub OAuth errors**: Invalid code, expired code, or other GitHub API errors

## Security Considerations

1. **SessionStorage**: Code verifiers are stored in `sessionStorage` rather than `localStorage`, which means they're cleared when the browser tab is closed
2. **State Parameter**: CSRF protection via random state values
3. **PKCE**: Prevents authorization code interception attacks
4. **No Client Secret**: The application doesn't require or store a client secret, making it suitable for public clients

## Testing the Flow

To test the authentication flow:

1. Ensure `VITE_GITHUB_CLIENT_ID` is set in your `.env` file
2. Optionally configure `VITE_CORS_PROXY_URL` if you have a custom proxy
3. Click "Sign in with GitHub" in the header
4. Authorize the application on GitHub
5. You will be redirected back with a code parameter
6. The application will handle the callback, exchange the code for a token, and show you as logged in

## Limitations

- Requires a CORS proxy for token exchange (GitHub's token endpoint doesn't support CORS)
- For production, you should set up your own CORS proxy rather than relying on public proxy services
- Tokens are stored in memory/sessionStorage and will be lost on page refresh (by design for security)

## Future Improvements

- Add token refresh capabilities
- Improve error handling and recovery with retry mechanisms
- Add support for token persistence (with user consent)
- Consider implementing a lightweight serverless function for token exchange to avoid CORS proxy dependency