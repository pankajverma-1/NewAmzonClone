import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  FETCH_FAIL,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from '../features/Fetch_product/Fetch_Product';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { CircularProgress } from '@mui/material';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Rating from '../Components/Rating';
import { CART_ADD_ITEM } from '../features/Cart/Cart';

const ProductScreen = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.Product.value
  );

  const { cartItem } = useSelector((state) => state.Cart.cart);

  const addToCard = async () => {
    const existProduct = cartItem.find((x) => x._id === product._id);
    const quantity = existProduct ? existProduct.quantity + 1 : 1;
    const { data } = await axios.get(`/api/product/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch(CART_ADD_ITEM({ ...product, quantity }));
  };
  useEffect(() => {
    const productDetails = async () => {
      dispatch(FETCH_REQUEST());
      try {
        const result = await axios.get(`/api/product/slug/${slug}`);
        dispatch(FETCH_SUCCESS(result.data));
      } catch (error) {
        dispatch(FETCH_FAIL(error.message));
      }
    };
    productDetails();
    return () => {
      productDetails();
    };
  }, [dispatch, slug]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>
          {error}
          <Helmet>
            <title>Error</title>
          </Helmet>
        </div>
      ) : (
        <div>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <Row>
            <Col md={6}>
              <img
                className="product-image"
                src={product.image.url}
                alt={product.name}
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h1>{product.name}</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>
                    Price : <strong>&#8377;{product.price}</strong>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>Description : {product.description}</div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    Rating={product.rating}
                    numrating={product.numReviews}
                  />
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>&#8377;{product.price}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Unavailable</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <div className="d-grid">
                          <Button variant="primary" onClick={addToCard}>
                            Add to Cart
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
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

export default ProductScreen;
