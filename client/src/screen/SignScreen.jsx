import { Link, useNavigate } from 'react-router-dom';
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { LOGIN_STATUS, USER_DATA } from '../features/Is_login/IsLogin';
import { CircularProgress } from '@mui/material';

export default function SigninScreen() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [circleLoader, setCircleLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCircleLoader(true);
    const { email, password } = userData;
    const { data } = await axios.post('/api/users/login', {
      email,
      password,
    });
    if (data) {
      dispatch(LOGIN_STATUS(true));
      dispatch(USER_DATA(data));
      setCircleLoader(false);
      navigate('/');
    }
  };
  return (
    <>
      <Container className="small-container mt-md-5">
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="my-3">Sign In</h1>
        <Form>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              value={userData.email}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              value={userData.password}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit" onClick={handleSubmit}>
              Sign In
            </Button>
          </div>
          <div className="mb-3">
            New customer? <Link to={`/signUp`}>Create your account</Link>
          </div>
        </Form>
      </Container>
      <div className={circleLoader ? 'loadingCircle' : 'd-none'}>
        <div className=" bg-light">
          <CircularProgress />
        </div>
      </div>
    </>
  );
}
