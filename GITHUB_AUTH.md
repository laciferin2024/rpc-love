# GitHub OAuth Authentication

This document explains how the GitHub OAuth authentication flow works in the RPC Love application.

## Overview

The application implements GitHub OAuth for user authentication, allowing users to sign in with their GitHub accounts to submit RPCs and make pull requests to the Chain Love repository.

## How It Works

1. **Authentication Initialization**:
   - When a user clicks "Sign in with GitHub" in the AppHeader component, the `signInWithGitHub()` function is called
   - This function redirects the user to GitHub's authorization page with appropriate OAuth parameters
   - A random state value is stored in localStorage for CSRF protection

2. **OAuth Callback Handling**:
   - After GitHub authorization, the user is redirected back to our application with `code` and `state` URL parameters
   - The AppHeader component automatically detects these parameters and processes them
   - The URL is immediately cleaned up (parameters removed) to prevent repeated processing

3. **Authentication Logic**:
   - The code attempts to exchange the GitHub code for an access token
   - In a production environment, this would require a server-side proxy due to CORS limitations
   - For demonstration purposes, if the OAuth code exchange fails due to CORS, the application falls back to mock authentication

4. **User Session**:
   - After successful authentication, the user's information is stored in the application's state
   - This includes an access token and user profile information
   - The UI updates to show the user's avatar and name in the header

## Implementation Details

The primary implementation can be found in:

- **src/components/layout/AppHeader.tsx**: Contains the authentication flow logic
- **src/lib/github.ts**: Provides GitHub API integration functions
- **src/store/rpc-form-store.ts**: Manages authentication state

## Mock Authentication

Since GitHub OAuth requires a server-side component to exchange codes for tokens (due to client secret requirements), this application includes a mock authentication mode that demonstrates the UI flow without requiring an actual server.

When the code exchange fails due to CORS restrictions, the application:

1. Creates a mock access token
2. Creates a mock user profile
3. Updates the authentication state as if a real authentication occurred

This allows testing the full UI flow even without a proper backend service.

## Testing the Flow

To test the authentication flow:

1. Click "Sign in with GitHub" in the header
2. Authorize the application on GitHub
3. You will be redirected back with a code parameter
4. The application will handle the callback and show you as logged in

## Limitations

- The current implementation cannot perform a real OAuth code exchange due to CORS restrictions
- In a production environment, you would need a server-side proxy to handle the token exchange
- The mock authentication is for demonstration purposes only and should not be used in production

## Future Improvements

- Implement a server-side proxy for handling the OAuth code exchange
- Add token refresh capabilities
- Improve error handling and recovery
- Add session persistence across browser sessions