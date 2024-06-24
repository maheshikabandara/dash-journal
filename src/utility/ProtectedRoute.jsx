import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ path, ...props }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? (
    <Route path={path} {...props} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
