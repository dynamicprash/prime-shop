import { Link } from 'react-router-dom';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <h1 className="text-3xl font-bold text-destructive">Payment was not completed</h1>
      <p className="text-muted-foreground">
        Your transaction with eSewa could not be completed or was cancelled. No money was deducted. You can try again or
        return to your cart to review your items.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/checkout"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try Again
        </Link>
        <Link
          to="/cart"
          className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;


