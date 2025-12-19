import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ShopProvider } from './context/ShopContext';
import { AdminProvider } from './admin/context/AdminContext';
import { syncUserToSupabase } from './utils/syncUserToSupabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import SSLCommerzPayment from './pages/SSLCommerzPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import Notifications from './pages/Notifications';
import Categories from './components/Categories';
import HotDeals from './components/HotDeals';

// Admin imports
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import ProductsManagement from './admin/pages/ProductsManagement';
import ProductForm from './admin/pages/ProductForm';
import OrdersManagement from './admin/pages/OrdersManagement';
import UsersManagement from './admin/pages/UsersManagement';
import CategoriesManagement from './admin/pages/CategoriesManagement';

function App() {
  const { user, isLoaded } = useUser();

  // Sync Clerk user to Supabase when user signs in
  useEffect(() => {
    if (isLoaded && user) {
      syncUserToSupabase(user);
    }
  }, [user, isLoaded]);

  return (
    <ShopProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Customer-facing routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <div className="App">
                  <Hero />
                  <Categories />
                  <HotDeals />
                  <ProductGrid />
                  <Footer />
                </div>
              </>
            } />
            <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
            <Route path="/wishlist" element={<><Navbar /><Wishlist /><Footer /></>} />
            <Route path="/profile" element={<><Navbar /><Profile /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
            <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
            <Route path="/notifications" element={<><Navbar /><Notifications /><Footer /></>} />
            <Route path="/payment/sslcommerz" element={<><Navbar /><SSLCommerzPayment /><Footer /></>} />
            <Route path="/payment/success" element={<><Navbar /><PaymentSuccess /><Footer /></>} />
            <Route path="/payment/fail" element={<><Navbar /><PaymentFail /><Footer /></>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="products/add" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
            </Route>
          </Routes>
        </Router>
      </AdminProvider>
    </ShopProvider>
  );
}

export default App;
