import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github, Link as LinkIcon, ChevronDown } from 'lucide-react';
export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg font-display">RPC Forge</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Network:</span>
              <Button variant="outline" disabled className="text-sm h-8">
                Filecoin
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}