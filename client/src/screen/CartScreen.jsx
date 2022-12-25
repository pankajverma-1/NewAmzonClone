import { Helmet } from 'react-helmet-async';
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../features/Cart/Cart';

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItem } = useSelector((state) => state.Cart.cart);

  const updatecart = async (item, quantity) => {
    const { data } = await axios.get(`/api/product/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch(CART_ADD_ITEM({ ...item, quantity }));
  };

  const deleteItem = async (item) => {
    dispatch(CART_REMOVE_ITEM(item));
  };
  const checkoutHandler = () => {
    navigate('/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItem.length === 0 ? (
            <h3>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </h3>
          ) : (
            <ListGroup>
              {cartItem.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image.url}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() => updatecart(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        <RemoveCircleOutlineIcon />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() => updatecart(item, item.quantity + 1)}
                        disabled={item.quantity === item.countInStock}
                      >
                        <AddCircleOutlineIcon />
                      </Button>
                    </Col>
                    <Col md={3}>&#8377;{item.price}</Col>
                    <Col md={2}>
                      <Button variant="light" onClick={() => deleteItem(item)}>
                        <DeleteOutlineIcon />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItem.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : &#8377;
                    {cartItem.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItem.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
