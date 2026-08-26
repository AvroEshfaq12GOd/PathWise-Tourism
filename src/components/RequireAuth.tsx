import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function RequireAuth({
  children,
  role



}: {children: React.ReactNode;role: 'tourist' | 'admin';}) {
  const { role: currentRole } = useAuth();
  const location = useLocation();
  if (currentRole !== role) {
    const redirectPath = role === 'admin' ? '/admin/login' : '/app/signin';
    return (
      <Navigate
        to={redirectPath}
        state={{
          from: location
        }}
        replace />);


  }
  return <>{children}</>;
}