import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center">
        {/* Loading Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin [animation-direction:reverse]"></div>
        </div>
        <p className="mt-4 text-slate-400 font-medium tracking-wide animate-pulse">Loading BrainVault...</p>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
