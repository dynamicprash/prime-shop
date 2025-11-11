import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/useCart.jsx';
import { fetchProductById } from '../api/products.js';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const result = await fetchProductById(id);
        if (isMounted) {
          setProduct(result);
          if (!result) {
            setError('Product not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load product details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const price = Number(product?.price ?? 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {error || 'Product Not Found'}
          </h1>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="aspect-square rounded-2xl overflow-hidden bg-accent shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ${price.toFixed(2)}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <button
                onClick={() => addToCart({ ...product, id: product.id, price })}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary hover:bg-secondary/80 text-secondary-foreground h-11 px-8 w-full"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>✓ Free shipping on orders over $50</p>
                <p>✓ 30-day return policy</p>
                <p>✓ Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

