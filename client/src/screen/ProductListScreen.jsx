import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from 'react-redux';
import {
  LIST_FAIL,
  LIST_REQUEST,
  LIST_SUCCESS,
  REMOVE_ITEM,
} from '../features/Product_page/Product_list';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import { toast, ToastContainer } from 'react-toastify';

export default function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, products, error, pages } = useSelector(
    (state) => state.ProductList.value
  );
  const [circleLoader, setCircleLoader] = useState(false);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const deleteItem = async (item) => {
    if (window.confirm('Are you sure delete this product ')) {
      setCircleLoader(true);
      const { data, status } = await axios.delete(
        `/api/product/delete/${item._id}`
      );

      // console.log(data);
      if (status === 200) {
        dispatch(REMOVE_ITEM(item));
        setCircleLoader(false);
        toast.success(data.message);
      } else {
        setCircleLoader(false);
        toast.error(data.message);
      }
    } else {
      toast.error('Select Ok to delete Product');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(LIST_REQUEST());
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`);

        dispatch(LIST_SUCCESS(data));
      } catch (err) {
        dispatch(LIST_FAIL(err));
        navigate('/signIn');
      }
    };
    fetchData();
  }, [page, dispatch, navigate]);

  return (
    <div>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Link to={'/admin/createProduct'}>
              <Button type="button" className=" btn-primary">
                Create Product
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <table className="table d-block d-md-table overflow-auto">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                  <td>
                    <Button variant="light" onClick={() => deleteItem(item)}>
                      <DeleteOutlineIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
          <div className={circleLoader ? 'loadingCircle' : 'd-none'}>
            <div className=" bg-light">
              <CircularProgress />
            </div>
          </div>
        </>
      )}
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
}
