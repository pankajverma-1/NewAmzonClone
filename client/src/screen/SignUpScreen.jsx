import Axios from 'axios';
import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { LOGIN_STATUS, USER_DATA } from '../features/Is_login/IsLogin';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

export default function SignupScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [circleLoader, setCircleLoader] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = userData;
    if (password !== cpassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setCircleLoader(true);
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      console.log(data);
      dispatch(LOGIN_STATUS(true));
      dispatch(USER_DATA(data));
      if (data.error) {
        toast.error(data.message);
        return;
      } else {
        setTimeout(() => {
          setCircleLoader(false);
          navigate('/');
        }, 1000);
      }
      toast.error(data.message);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            onChange={handleChange}
            value={userData.name}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            name="email"
            onChange={handleChange}
            value={userData.email}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            name="password"
            onChange={handleChange}
            value={userData.password}
          />
          <Form.Group className="mb-3" controlId="cpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="cpassword"
              onChange={handleChange}
              value={userData.cpassword}
              required
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button onClick={submitHandler}>Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account? <Link to={'/signin'}>Sign-In</Link>
        </div>
      </Form>
      <div className={circleLoader ? 'loadingCircle' : 'd-none'}>
        <div className=" bg-light">
          <CircularProgress />
        </div>
      </div>
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
    </Container>
  );
}
