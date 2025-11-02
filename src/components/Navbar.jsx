import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/useCart.jsx';

// Simple Badge component - defined inline
const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variantStyles = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };

  const styles = [
    baseStyles,
    variantStyles[variant] || variantStyles.default,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={styles} {...props}>{children}</div>;
};

const Navbar = () => {
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            Lovable Shop
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
