import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, LogIn } from 'lucide-react';
import { useCart } from '../contexts/useCart.jsx';
import { useAuth } from '../contexts/authContext.jsx';
import { useToast } from '../hooks/use-toast.js';

const Badge = ({ className = '', children, ...props }) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold transition-colors';

  return (
    <span className={`${baseStyles} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
};

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            Prime Shop
          </Link>
          
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/products') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Products
            </Link>
            {isAuthenticated && user?.role === 'manager' && (
              <Link
                to="/add-product"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/add-product') ? 'text-primary' : 'text-foreground'
                }`}
              >
                Add Product
              </Link>
            )}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive('/cart') ? 'text-primary' : 'text-foreground'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link to="/auth">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
