import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { CART_ADD_ITEM } from '../features/Cart/Cart';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Porduct = ({ product }) => {
  // console.log('Product');
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.Cart.cart);

  const addToCart = async () => {
    const existProduct = cartItem.find((x) => x._id === product._id);
    const quantity = existProduct ? existProduct.quantity + 1 : 1;
    const { data } = await axios.get(`/api/product/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch(CART_ADD_ITEM({ ...product, quantity }));
  };
  return (
    <>
      <Card>
        <Link to={`product/${product.slug}`}>
          <Card.Img variant="top" src={product.image.url} alt={product.name} />
        </Link>
        <Card.Body>
          <Link to={`product/${product.slug}`}>
            <Card.Title>
              <strong>
                <div>{product.name}</div>
              </strong>
            </Card.Title>
          </Link>
          <Card.Text>
            <div>
              Price : &#8377; <strong>{product.price}</strong>
            </div>
            <div>
              <Rating Rating={product.rating} numrating={product.numReviews} />
            </div>
          </Card.Text>
        </Card.Body>
        <ButtonGroup>
          {product.countInStock === 0 ? (
            <Button variant="light" disabled>
              Out of stock
            </Button>
          ) : (
            <Button onClick={addToCart}>Add to cart</Button>
          )}
        </ButtonGroup>
      </Card>
    </>
  );
};

export default Porduct;
