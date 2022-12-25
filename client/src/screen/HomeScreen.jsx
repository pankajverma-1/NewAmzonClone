import React, { useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch, useSelector } from 'react-redux';
import {
  FETCH_FAIL,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from '../features/FetchQu/Fetch_Query';

import Porduct from '../Components/Porduct';

import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Helmet } from 'react-helmet-async';

function HomeScreen() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.Fetch.value
  );
  // console.log('homescreen');

  useEffect(() => {
    const fetchData = async () => {
      //  console.log('product');
      dispatch(FETCH_REQUEST());
      try {
        // console.log('result.data1');
        const result = await axios.get('/api/products');
        // console.log('result.data1', result.data);
        dispatch(FETCH_SUCCESS(result.data));
      } catch (error) {
        dispatch(FETCH_FAIL(error.message));
      }
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>
          <Helmet>
            <title>Error</title>
          </Helmet>
          <div>{error}</div>
        </div>
      ) : (
        <div>
          <Helmet>
            <title>amazon</title>
          </Helmet>
          <h1>Featured Products </h1>
          <Row>
            {products.map((product, i) => (
              <Col className="mb-2" key={i} sm={6} md={4} lg={3}>
                <Porduct product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
