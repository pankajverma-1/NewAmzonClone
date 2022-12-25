import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { data } = useSelector((state) => state.Login.value);
  useEffect(() => {
    setTimeout(function () {
      return data && data.isAdmin ? children : <Navigate to="/signIn" />;
    }, 1000);
  }, [children, data]);

  return (
    <>
      {/* {data && data.isAdmin ? children : <Navigate to="/signIn" />} */}
      <Outlet />
    </>
  );
}
