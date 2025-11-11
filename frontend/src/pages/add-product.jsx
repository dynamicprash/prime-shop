import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/authContext';
import { useToast } from '../hooks/use-toast.js';
import { createProduct } from '../api/products.js';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'manager')) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'manager') {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!name || !price || !description || !image || !category) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct({
        name,
        price: Number(price),
        description,
        image,
        category,
      });

      toast({
        title: 'Success',
        description: 'Product added successfully!',
      });

      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setCategory('');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 401
          ? 'You must be signed in as a manager to add products.'
          : 'Failed to add product. Please try again.');

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter product name"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-foreground">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="0.00"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g., Electronics, Clothing, Books"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-foreground">
              Image URL
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter product description"
              rows={5}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

