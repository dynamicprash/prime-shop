import { useEffect, useState } from 'react';
import ProductCard from '../components/product-card.jsx';
import { fetchProducts } from '../api/products.js';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const result = await fetchProducts();
        if (isMounted) {
          setProducts(result);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load products');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our carefully curated collection of products. Each item is selected with care to bring joy to your life! 🌟
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading && (
            <p className="col-span-full text-center text-muted-foreground">
              Loading products...
            </p>
          )}

          {error && !isLoading && (
            <p className="col-span-full text-center text-destructive">
              {error}
            </p>
          )}

          {!isLoading && !error && products.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No products available yet. Please check back soon!
            </p>
          )}

          {!isLoading &&
            !error &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

