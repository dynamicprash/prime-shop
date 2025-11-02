const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-accent/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lovable Shop. Made with ❤️ for delightful shopping.
          </p>
          <p className="text-xs text-muted-foreground">
            All rights reserved. Happy shopping!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
