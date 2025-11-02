import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/home.jsx';
import Products from './pages/product.jsx';
import ProductDetail from './pages/product-detail.jsx';
import Cart from './pages/cart.jsx';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={
            <ProductDetail />
          } />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
