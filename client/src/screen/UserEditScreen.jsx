import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import { CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Alert from 'react-bootstrap/Alert';

const UserEditScreen = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState('');
  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [isAdmin, setIsAdmin] = useState('');
  const [circleLoader, setCircleLoader] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setCircleLoader(true);
      const { data, status } = await axios.put(`/api/userEdit/${id}`, {
        _id: id,
        name,
        email,
        isAdmin,
      });
      // console.log(data);
      if (status === 200) {
        setCircleLoader(false);
        toast.success(data.message);
      } else {
        setCircleLoader(false);
        toast.error(data.message);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCircleLoader(true);
        const { data, status } = await axios.get(`/api/user/${id}`);
        // console.log(data);
        if (status === 200) {
          setUserData(data);
          setName(data.name);
          setEmail(data.email);
          setIsAdmin(data.isAdmin);
          setCircleLoader(false);
        } else {
          setCircleLoader(false);

          return (
            <Alert variant="danger" className=" text-center">
              User Not Found
            </Alert>
          );
        }
      } catch (error) {
        setCircleLoader(false);
        // console.log(error);
        toast.error('User Not Found');
      }
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, [id]);

  return (
    <div>
      <Container className="small-container">
        <Helmet>
          <title>Edit User ${id}</title>
        </Helmet>
        <h1>Edit User {id}</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className="mb-3">
            <Button type="submit">Update</Button>
          </div>
        </Form>
      </Container>
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
    </div>
  );
};

export default UserEditScreen;
