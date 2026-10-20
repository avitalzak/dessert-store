import './App.css'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { FaUser, FaShoppingCart, FaHome } from "react-icons/fa"

import HomePage from './Pages/homePage';
import ShoppingCart from './Pages/shoppingCartPage';
import PaymentPage from './Pages/paymentPage';
import SignUpPage from './Pages/signUpPage';
import SignInPage from './Pages/signInPage';
import User from './Pages/userPage';
import UserOrders from './Pages/userOrdersPage';
import UserFavorites from './Pages/userFavoritesPage';
import Summary from './Components/summary';
import OrderCard from './Components/orderCard';
import BirthdayBanner from './Components/birthDay';
import ProductBuilder from './Components/productBuilder';
import ProductList from './Components/productList';
import Admin from './Components/admin';
import AdminRoute from './Components/adminRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCurrentUser } from './redux/Slice/userSlice';
import CategoriesPage from './Pages/CategoriesPage';
import Header from './Components/header';
import { FaGear } from 'react-icons/fa6';
import HelpButton from './Components/Help';
import { fetchCartFromServer } from './redux/Slice/cartSlice';
import ProductsPage from './Pages/ProductsPage';
import OrderBar from './Components/OrderBar';
import { isTheme } from './theme/theme';
import IdleReset from './Components/kiosk/IdleReset';
import { isTabletView } from './device/device';






function App() {

  const dispatch = useDispatch()

    useEffect(() => {
        const token = localStorage.getItem("jwtToken")
        if (token) {
            // טוענים את העגלה מהשרת רק אחרי שהטוקן אומת
            dispatch(fetchCurrentUser())
                .unwrap()
                .then(() => dispatch(fetchCartFromServer()))
                .catch(() => {})
        }
    }, [dispatch])

    const user = useSelector(state => state.user.user)
    const cartCount = useSelector(state => (state.cart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0))
  
    return(
    <>
      
        <header className="topbar">
          <div className="topbar-nav-row">
            
            <div className="topbar-right">
       
              <NavLink to="/" end className="icon-btn">
                <FaHome />
                <span>בית</span>
              </NavLink>

              <NavLink to="/shoppingcart" className="icon-btn">
                <FaShoppingCart />
                {cartCount > 0 && <span className="nav-badge kiosk-only" key={cartCount}>{cartCount}</span>}
                <span>עגלה</span>
              </NavLink>
  
              <NavLink to="/user" className="icon-btn">
                <FaUser />
                <span>אזור אישי</span>
              </NavLink>
  
              {user?.role === "admin" && (
                <NavLink to="/admin" className="icon-btn">
                  <FaGear/>
                  <span>ניהול</span>
                </NavLink>
              )}
             
              <Header/>
             
              <HelpButton/>
            </div>
          </div>

          <div className="logo-french">
            LA CRÉATION DÉLICIEUSE
            <span className="logo-tagline atelier-only">Pâtisserie · Glacier</span>
          </div>
          
        </header>

        <BirthdayBanner/>

        <div className="page-content">
          <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/categories' element={<CategoriesPage/>}/>
                <Route path='/products' element={<ProductsPage/>}>
                  <Route index element={<ProductList/>}/>  
                  <Route path='build/:productId' element={<ProductBuilder/>}/>
                  <Route path='build/:productId/summary' element={<Summary/>}/>
                </Route>
              

             
              <Route path='/shoppingcart' element={<ShoppingCart/>}>
                <Route path='payment' element={<PaymentPage/>}/>
              </Route>
              <Route path='/user' element={<User/>}>
                <Route path='signUp' element={<SignUpPage/>}/>
                <Route path='signIn' element={<SignInPage/>}/>
                <Route path='myOrders' element={<UserOrders/>}>
                    <Route path=':id' element={<OrderCard/>}/>
                </Route>
                <Route path='myFavorites' element={<UserFavorites/>}/>

              </Route>
              <Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>}/> 
          </Routes>
        </div>

        {isTheme("kiosk") && <OrderBar/>}
        {isTabletView && <IdleReset/>}
    </>
    )
              
}

export default App