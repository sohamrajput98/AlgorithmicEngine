import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

export default function PrivateRoute({ children }) {
  return children // temporarily bypass auth
}
