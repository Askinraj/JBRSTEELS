import './App.css';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/Home';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/product/ProductDetail';
import ProductSearch from './components/product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { loadUser } from './actions/userActions';
import { useEffect } from 'react';
import store from './store';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute'
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';

function App() {
  useEffect(()=>{
    store.dispatch(loadUser)
  })
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
            <Header />
            <div className='container container-fluid'>
            <ToastContainer theme='dark'/>
            <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='/search/:keyword' element={<ProductSearch />}/>
              <Route path='/product/:id' element={<ProductDetail />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />} />
              <Route path='/myprofile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
              <Route path='/api/v1/password/change' element={< UpdatePassword/>} />
              <Route path='/forgot' element={< ForgotPassword />} />
              <Route path='/api/v1/password/reset/:token' element={<ResetPassword />} />
            </Routes>
            </div>
            <Footer />
          </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
