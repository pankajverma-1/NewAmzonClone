import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../Components/CheckoutSteps';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_PAYMENT_METHOD } from '../features/Cart/Cart';
import { useNavigate } from 'react-router-dom';

const PaymentMethodScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentMethodName } = useSelector((state) => state.Cart.cart);
  const { shippingAddress } = useSelector((state) => state.Cart.cart);
  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodName || 'PayPal'
  );
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(SAVE_PAYMENT_METHOD(paymentMethod));
    localStorage.setItem('paymentMethodType', paymentMethod);
    navigate('/placeorder');
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  return (
    <div>
      <Helmet>
        <title>Payment Methods</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Google Pay"
              label="Google Pay"
              value="Google Pay"
              checked={paymentMethod === 'Google Pay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Phone pay"
              label="Phone pay"
              value="Phone pay"
              checked={paymentMethod === 'Phone pay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="UPI"
              label="UPI"
              value="UPI"
              checked={paymentMethod === 'UPI'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodScreen;
