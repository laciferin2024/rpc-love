import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github, Link as LinkIcon, ChevronDown, LogOut } from 'lucide-react';
import { useRpcFormStore } from '@/store/rpc-form-store';
import { signInWithGitHub, handleGitHubCallback, getGitHubUserProfile } from '@/lib/github';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function AppHeader() {
  const isAuthenticated = useRpcFormStore((s) => s.auth.isAuthenticated);
  const user = useRpcFormStore((s) => s.auth.user);
  const logout = useRpcFormStore((s) => s.logout);
  const setAuth = useRpcFormStore((s) => s.setAuth);
  const [isHandlingCallback, setIsHandlingCallback] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      if (code && state) {
        // Clean up URL immediately to prevent multiple handling attempts
        navigate(window.location.pathname, { replace: true });
        try {
          toast.info('Authenticating with GitHub...');
          const accessToken = await handleGitHubCallback(code, state);
          const userProfile = await getGitHubUserProfile(accessToken);
          setAuth({ accessToken, user: userProfile });
          toast.success(`Welcome, ${userProfile.login}!`);
        } catch (error) {
          console.error('GitHub OAuth Error:', error);
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          toast.error('GitHub Sign In Failed', { description: errorMessage });
        }
      }
      setIsHandlingCallback(false);
    };
    handleAuthCallback();
  }, [navigate, setAuth]);
  if (isHandlingCallback) {
    return <div className="h-16" />; // Render a placeholder to prevent layout shift
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg font-display">RPC Love</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Network:</span>
              <Button variant="outline" disabled className="text-sm h-8">
                Filecoin
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} alt={user.login} />
                      <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || user.login}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email || 'No public email'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => signInWithGitHub().catch((err) => {
                console.error('Failed to initiate GitHub sign in:', err);
                toast.error('Failed to initiate GitHub sign in', { description: err.message });
              })}>
                <Github className="mr-2 h-4 w-4" />
                Sign in with GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}