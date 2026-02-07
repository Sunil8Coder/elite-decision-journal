import { Plus, LogOut, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onAddDecision: () => void;
  showAddButton: boolean;
}

export function Header({ onAddDecision, showAddButton }: HeaderProps) {
  const { user, signOut, isAdmin } = useAuthContext();

  return (
    <header className="sticky top-0 z-10 glass border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Decision Journal" className="h-10 w-10 rounded-lg" />
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Decision Journal
            </h1>
            <p className="text-xs text-muted-foreground">
              {user ? `Hi, ${user.name}` : 'Elite performers only'}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {showAddButton && (
            <Button onClick={onAddDecision} variant="accent" size="sm">
              <Plus className="h-4 w-4" />
              New
            </Button>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin() && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
