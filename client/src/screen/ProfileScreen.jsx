import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState({
    newPassword: '',
    oldPassword: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };
  const { data } = useSelector((state) => state.Login.value);

  useEffect(() => {
    const auth = async () => {
      const { data } = await axios.get('/api/auth');
      // console.log('data', data);
      if (!data) {
        navigate('/signIn');
      }
    };
    auth();
    return () => {
      auth();
    };
  }, [navigate]);
  const submitHandler = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = password;
    try {
      const { data } = axios.put('/api/user/update', {
        oldPassword,
        newPassword,
      });
      if (data) {
      }
    } catch (error) {
      navigate('/signIn');
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control value={data.name} required readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={data.email} required readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type="password"
            value={password.oldPassword}
            name="oldPassword"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password1">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={password.newPassword}
            name="newPassword"
            onChange={handleChange}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileScreen;
