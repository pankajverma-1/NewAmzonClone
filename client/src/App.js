import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import ProductScreen from './screen/ProductScreen';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';
import CartScreen from './screen/CartScreen';
import SigninScreen from './screen/SignScreen';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/esm/Button';
import ShippingAddressScreen from './screen/ShippingScreen';
import SignupScreen from './screen/SignUpScreen';
import PaymentMethodScreen from './screen/PaymentMethodScreen';
import PlaceOrder from './screen/PlaceOrder';
import { useEffect } from 'react';
import axios from 'axios';
import { LOGIN_STATUS, USER_DATA } from './features/Is_login/IsLogin';
import OrderScreen from './screen/OrderScreen';
import OrderHistoryScreen from './screen/OrderHistoryScreen';
import ProfileScreen from './screen/ProfileScreen';
import DashboardScreen from './screen/DashboardScreen';
import AdminRoute from './Components/AdminRoute';
import ProductListScreen from './screen/ProductListScreen';
import CreateProduct from './screen/CreateProduct';
import OrderListScreen from './screen/OrderListScreen';
import UserListScreen from './screen/UserListScreen';
import UserEditScreen from './screen/UserEditScreen';
import { Helmet } from 'react-helmet-async';

function App() {
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.Cart.cart);
  const { islogin, data } = useSelector((state) => state.Login.value);
  useEffect(() => {
    // console.log('auth');
    const auth = async () => {
      // console.log('auth');
      const { data } = await axios.get('/api/auth');
      if (data) {
        dispatch(LOGIN_STATUS(true));
        dispatch(USER_DATA(data));
      }
    };
    auth();
    return () => {
      auth();
    };
  }, [dispatch]);

  const logout = async () => {
    const { data } = await axios.get('/api/user/logout');
    if (data) {
      toast.success(data.message);

      dispatch(LOGIN_STATUS(false));
      dispatch(USER_DATA(''));
    }
  };
  return (
    <>
      <BrowserRouter>
        <header>
          <Helmet>
            <title>amazon</title>
          </Helmet>
          <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            className="d-flex justify-content-around"
          >
            <Container className="m-2">
              <LinkContainer to="/">
                <Navbar.Brand>amazon</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto  w-100  justify-content-end">
                  {islogin ? (
                    <NavDropdown
                      title={data.name}
                      id="basic-nav-dropdown"
                      className="navlink"
                    >
                      <LinkContainer to="/profile" className="navlinks">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory" className="navlinks">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <Button className=" w-100" onClick={logout}>
                          LogOut
                        </Button>
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <div className="registerContainer">
                      <Link to="/signIn" className="navlink mx-1">
                        Login
                      </Link>
                      <Link to="/signUp" className="navlink mx-1">
                        Signup
                      </Link>
                    </div>
                  )}
                  {data.isAdmin ? (
                    <NavDropdown
                      title="Admin"
                      id="basic-nav-dropdown"
                      className="navlink"
                    >
                      <LinkContainer to="/admin/dashboard" className="navlinks">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products" className="navlinks">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/allOrders" className="navlinks">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/admin/allUser" className="navlinks">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  ) : (
                    ''
                  )}

                  {cartItem.length > 0 ? (
                    <Link to="/cart" className="navlink">
                      <Badge
                        badgeContent={cartItem.reduce(
                          (a, c) => a + c.quantity,
                          0
                        )}
                        color="warning"
                      >
                        cart
                      </Badge>
                    </Link>
                  ) : (
                    ''
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <main className="min-vh-100 ">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />

              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/signUp" element={<SignupScreen />} />
              <Route path="/signIn" element={<SigninScreen />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route path="products" element={<ProductListScreen />} />
                <Route path="dashboard" element={<DashboardScreen />} />
                <Route path="createProduct" element={<CreateProduct />} />
                <Route path="allOrders" element={<OrderListScreen />} />
                <Route path="allUser" element={<UserListScreen />} />
                <Route path="editUser/:id" element={<UserEditScreen />} />
              </Route>
            </Routes>
          </Container>
        </main>
        <footer className="text-center w-100 bottom-0">
          <div className="text-center">All rights reserved</div>
        </footer>
      </BrowserRouter>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
