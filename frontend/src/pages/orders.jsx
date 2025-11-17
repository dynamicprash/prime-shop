import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.jsx';
import { fetchAllOrders, fetchOrders, updateOrderStatus } from '../api/orders.js';
import { useToast } from '../hooks/use-toast.js';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isManager = user?.role === 'manager';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to view your orders.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (isAuthenticated) {
      const loadOrders = async () => {
        try {
          setIsLoading(true);
          const data = isManager ? await fetchAllOrders() : await fetchOrders();
          setOrders(data || []);
        } catch (error) {
          const message =
            error.response?.data?.message || 'Failed to load orders. Please try again.';
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      loadOrders();
    }
  }, [isAuthenticated, authLoading, user, navigate, toast, isManager]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
      toast({
        title: 'Status updated',
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update order status. Please try again.';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isManager ? 'Order History' : 'My Orders'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isManager
              ? 'View and manage all customer orders'
              : 'View your order history and track your purchases'}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No orders found yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      {isManager && (
                        <p className="text-sm text-muted-foreground">
                          {order.name?.name || 'Customer'} ({order.email})
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {isManager && (
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <h4 className="font-semibold mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-3">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {item.product?.name || 'Product'}
                              </p>
                              <p className="text-muted-foreground">
                                Qty: {item.quantity} × ${item.unitPrice?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold">
                            ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <h4 className="font-semibold mb-2">Shipping Address:</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.streetAddress}, {order.city} {order.zipCode}
                    </p>
                    <p className="text-sm text-muted-foreground">Phone: {order.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

