import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CircularProgress } from '@mui/material';
import Alert from 'react-bootstrap/Alert';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [circleLoader, setCircleLoader] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setCircleLoader(true);
      try {
        const { data } = await axios.get('/api/user/userList');
        if (data) {
          // console.log(data);
          setUsers(data);
          setCircleLoader(false);
        }
      } catch (error) {
        setCircleLoader(false);
        toast.error('You are not a Admin');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, []);

  const deleteItem = async (item) => {
    try {
      if (window.confirm('Are you sure to delete this User')) {
        setCircleLoader(true);
        const { data, status } = await axios.delete(
          `/api/user/deleteUser/${item._id}`
        );
        if (status === 200) {
          const order = users.filter((items) => items._id !== item._id);
          setUsers(order);
          setCircleLoader(false);
          toast.success(data.message);
        } else {
          setCircleLoader(false);
          toast.error(data.message);
        }
      } else {
        toast.error('Select OK to delete User');
      }
    } catch (error) {
      // console.log(error);
      setCircleLoader(false);
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      {users.length !== 0 ? (
        <table className="table d-block d-md-table overflow-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.isAdmin ? 'Yes' : 'No'}</td>

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
                    onClick={() => navigate(`/admin/editUser/${item._id}`)}
                  >
                    <EditIcon />
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

export default UserListScreen;
