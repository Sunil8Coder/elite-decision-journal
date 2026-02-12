import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Decisions', href: '/features/decisions' },
  { label: 'Diary', href: '/features/diary' },
  { label: 'Notes', href: '/features/notes' },
  { label: 'Books', href: '/features/books' },
  { label: 'Planner', href: '/features/planner' },
];

export function LandingHeader() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Brain className="h-6 w-6 text-primary" />
          Decision Journal
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm transition-colors hover:text-primary ${
                location.pathname === link.href ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button variant="accent" size="sm" asChild>
              <Link to="/">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="accent" size="sm" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-primary py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            {isAuthenticated ? (
              <Button variant="accent" size="sm" className="w-full" asChild>
                <Link to="/">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="accent" size="sm" className="w-full" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
