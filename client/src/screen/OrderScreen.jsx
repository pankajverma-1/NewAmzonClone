import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import { CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import {
  ORDERS_FAIL,
  ORDERS_REQUEST,
  ORDERS_SUCCESS,
} from '../features/Order/Orders';

const OrderScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useSelector(
    (state) => state.Orders.value
  );

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch(ORDERS_REQUEST());
        const { data } = await axios.get(`/api/order/${id}`);
        dispatch(ORDERS_SUCCESS(data));
      } catch (error) {
        dispatch(ORDERS_FAIL(error.message));
      }
    };
    fetchOrder();
    return () => {
      fetchOrder();
    };
  }, [id, navigate, dispatch]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>
          <Alert variant="danger">{error}</Alert>
        </div>
      ) : (
        <div>
          <Helmet>
            <title>Order {id}</title>
          </Helmet>
          <h1 className="my-3">Order {id}</h1>
          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Shipping</Card.Title>
                  <Card.Text>
                    <strong>Name:</strong> {product.shippingAddress.fullName}
                    <br />
                    <strong>Address: </strong> {product.shippingAddress.address}
                    ,{product.shippingAddress.city},
                    {product.shippingAddress.postalCode},
                    {product.shippingAddress.country}
                  </Card.Text>
                  {product.isDelivered ? (
                    <Alert variant="success">
                      Delivered at {product.deliveredAt}
                    </Alert>
                  ) : (
                    <Alert variant="danger">Not Delivered</Alert>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Payment</Card.Title>
                  <Card.Text>
                    <strong>Method:</strong> {product.paymentMethod}
                  </Card.Text>
                  {product.isPaid ? (
                    <Alert variant="success">Paid at {product.paidAt}</Alert>
                  ) : (
                    <Alert variant="danger">Not Paid</Alert>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Items</Card.Title>
                  <ListGroup variant="flush">
                    {product.orderItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                          <Col md={6}>
                            <img
                              src={item.image.url}
                              alt={item.name}
                              className="img-fluid rounded img-thumbnail"
                            ></img>
                            <Link to={`/product/${item.slug}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={3}>
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md={3}>&#8377;{item.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>&#8377;{product.itemsPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>&#8377;{product.shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>&#8377;{product.taxPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong> Order Total</strong>
                        </Col>
                        <Col>
                          <strong>
                            &#8377;{product.totalPrice.toFixed(2)}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default OrderScreen;
