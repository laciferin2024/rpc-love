import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme, type ThemeMode } from '@/hooks/use-theme';
import { Monitor, Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'select';
}

export function ThemeToggle({ className = "absolute top-4 right-4", variant = 'select' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  if (variant === 'button') {
    // Cycle through themes: light -> dark -> system -> light
    const cycleTheme = () => {
      const themes: ThemeMode[] = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex]);
    };

    const getIcon = () => {
      if (theme === 'system') {
        return <Monitor className="h-4 w-4" />;
      }
      return resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
    };

    return (
      <Button 
        onClick={cycleTheme} 
        variant="ghost"
        size="icon"
        className={`${className} z-50`}
        aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      >
        {getIcon()}
      </Button>
    );
  }

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as ThemeMode)}>
      <SelectTrigger className={`${className} w-[140px] z-50`} aria-label="Select theme">
        <SelectValue>
          <div className="flex items-center gap-2">
            {theme === 'system' && <Monitor className="h-4 w-4" />}
            {theme === 'light' && <Sun className="h-4 w-4" />}
            {theme === 'dark' && <Moon className="h-4 w-4" />}
            <span className="capitalize">{theme}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
