import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthContext } from '../Context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuthContext();
  const location = useLocation();

  if (!authState.token) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
