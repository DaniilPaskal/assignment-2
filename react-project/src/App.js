import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import Account from './pages/Account';
import Cart from './pages/Cart';
import TransactionComplete from './pages/TransactionComplete';
import Error from './pages/Error';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />

          <Routes>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="account" element={<Account/>} />
            <Route path="cart" element={<Cart />} />
            <Route path="done/:transaction" element={<TransactionComplete />} />
            <Route path="*" element={<Error />} />
          </Routes>

      <Footer />
    </div>
  );
}

export default App;
