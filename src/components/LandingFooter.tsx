import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-foreground mb-3">
              <Brain className="h-5 w-5 text-primary" />
              Decision Journal
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track decisions, reflect on outcomes, and grow through self-awareness.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Features</h4>
            <ul className="space-y-2">
              <li><Link to="/features/decisions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Decision Tracker</Link></li>
              <li><Link to="/features/diary" className="text-sm text-muted-foreground hover:text-primary transition-colors">Diary</Link></li>
              <li><Link to="/features/notes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Notes</Link></li>
              <li><Link to="/features/books" className="text-sm text-muted-foreground hover:text-primary transition-colors">Book Shelf</Link></li>
              <li><Link to="/features/planner" className="text-sm text-muted-foreground hover:text-primary transition-colors">Planner</Link></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Features</Link></li>
              <li><Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sign Up</Link></li>
              <li><Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Log In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-sm text-muted-foreground">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Decision Journal. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for better thinking.
          </p>
        </div>
      </div>
    </footer>
  );
}
