import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ReturnOrder from './pages/ReturnOrder';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/ui/CartDrawer';

import './App.css';

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let keys = '';
    const handleKeyDown = (e) => {
      keys += e.key.toLowerCase();
      if (keys.includes('admin')) {
        navigate('/login');
        keys = ''; // reset after hit
      }
      if (keys.length > 10) keys = keys.slice(-10); // cap buffer size
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <CartDrawer />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/return" element={<ReturnOrder />} />
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
