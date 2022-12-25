import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from 'react-bootstrap/Alert';
import InfoIcon from '@mui/icons-material/Info';
import { CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [circleLoader, setCircleLoader] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setCircleLoader(true);
      const { data } = await axios.get('/api/orders/orderList');
      if (data) {
        // console.log(data);
        setOrders(data);
        setCircleLoader(false);
      }
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, []);

  const deleteItem = async (item) => {
    try {
      if (window.confirm('Are you sure delete this Order')) {
        setCircleLoader(true);
        const { data, status } = await axios.delete(
          `/api/orders/deleteOrder/${item._id}`
        );
        if (status === 200) {
          const order = orders.filter((items) => items._id !== item._id);
          setOrders(order);
          setCircleLoader(false);
          toast.success(data.message);
        } else {
          setCircleLoader(false);
          toast.error(data.message);
        }
      } else {
        toast.error('Select ok to delete Order');
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <>
      {orders.length !== 0 ? (
        <table className="table d-block d-md-table overflow-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.shippingAddress.fullName}</td>
                <td>{item.createdAt.slice(0, 10)}</td>
                <td>{item.itemsPrice}</td>
                <td>{item.isDelivered ? 'Yes' : 'No'}</td>
                <td>{item.isPaid ? 'Yes' : 'No'}</td>

                <td>
                  <Button
                    variant="light"
                    className="mx-1"
                    onClick={() => deleteItem(item)}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                  <Button
                    variant="light"
                    className="mx-1"
                    onClick={() => navigate(`/order/${item._id}`)}
                  >
                    <InfoIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Alert variant="danger" className=" text-center">
          No Orders found
        </Alert>
      )}
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
    </>
  );
};

export default OrderListScreen;
