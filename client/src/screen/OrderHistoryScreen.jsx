import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import {
  ORDER_FAIL,
  ORDER_REQUEST,
  ORDER_SUCCESS,
} from '../features/OrderDetailes/OrderDetails';

const OrderHistoryScreen = () => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.Order.value);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(ORDER_REQUEST());
        const { data } = await axios.get(`/api/order/history`);
        dispatch(ORDER_SUCCESS(data));
      } catch (error) {
        dispatch(ORDER_FAIL(error.message));
      }
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, [dispatch]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>
          <Alert variant="danger">{error}</Alert>
        </div>
      ) : product.length !== 0 ? (
        <table className="table d-block d-md-table overflow-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {product.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button type="button" variant="light">
                    <Link to={`/order/${order._id}`}>Details</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <Alert variant="danger">No Order Found</Alert>
          <h3>
            <Link to="/">Go Shopping</Link>
          </h3>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryScreen;
