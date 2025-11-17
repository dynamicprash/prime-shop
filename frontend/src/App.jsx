import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/home.jsx';
import Products from './pages/product.jsx';
import ProductDetail from './pages/product-detail.jsx';
import Cart from './pages/cart.jsx';
import Auth from './pages/auth.jsx';
import AddProduct from './pages/add-product.jsx';
import Checkout from './pages/checkout.jsx';
import PaymentSuccess from './pages/payment-success.jsx';
import PaymentFailure from './pages/payment-failure.jsx';
import Orders from './pages/orders.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
