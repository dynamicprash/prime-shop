import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/useCart.jsx";
import { useToast } from "../hooks/use-toast.js";

export default function ProductCard({ product, content, className = "" }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const productId = product?._id || product?.id;
  const price = Number(product?.price ?? 0);
  const productName = product?.name ?? 'Product';

  const handleAddToCart = () => {
    const action = addToCart({ ...product, id: productId, price });
    toast({
      title: action === 'updated' ? 'Cart updated' : 'Added to cart',
      description:
        action === 'updated'
          ? `${productName} quantity increased in your cart.`
          : `${productName} has been added to your cart.`,
    });
  };

  // If content prop is provided, render it as a simple card
  if (content) {
    return (
      <div className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`.trim()}>
        {content}
      </div>
    );
  }

  // Default: render product card
  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm group overflow-hidden transition-all duration-300 hover:shadow-lg">
      
      <Link to={`/product/${productId}`}>
        <div className="aspect-square overflow-hidden bg-accent">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${productId}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>

        <p className="text-xl font-bold text-primary">${price.toFixed(2)}</p>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground h-11 rounded-md font-medium hover:bg-secondary/80 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
