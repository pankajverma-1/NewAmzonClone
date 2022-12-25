import React, { useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const CreateProduct = () => {
  const [userData, setUserData] = useState({
    name: '',
    slug: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    description: '',
  });
  const [File, setFile] = useState('');
  const [circleLoader, setCircleLoader] = useState(false);
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    const bodyFormData = new FormData();
    bodyFormData.append('data', JSON.stringify(userData));
    const file = e.target.files[0];
    bodyFormData.append('file', file);
    setFile(bodyFormData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure Create this Product')) {
      setCircleLoader(true);
      const { data } = await axios.post(
        '/api/product/createProduct',

        File,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (data) {
        setCircleLoader(false);
        toast.success(data.message);
        setUserData({
          name: '',
          slug: '',
          price: '',
          category: '',
          brand: '',
          countInStock: '',
          description: '',
        });
      } else {
        setCircleLoader(false);
        toast.error('Product Already');
      }
    }
  };
  return (
    <>
      <Container className="small-container">
        <Helmet>
          <title>Create Product</title>
        </Helmet>
        <h1>Create A product</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={userData.name}
              name="name"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={userData.slug}
              name="slug"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={userData.price}
              name="price"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={userData.category}
              name="category"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={userData.brand}
              name="brand"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={userData.countInStock}
              name="countInStock"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={userData.description}
              name="description"
              onChange={onChangeHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control type="file" onChange={onChangeHandler} required />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Create</Button>
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
    </>
  );
};

export default CreateProduct;
