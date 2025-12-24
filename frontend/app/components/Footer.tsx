export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <span className="font-display text-xl font-bold text-primary-foreground">E</span>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">EstateToken</h3>
              <p className="text-xs text-muted-foreground">Real Estate for EVMs</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 EstateToken. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
