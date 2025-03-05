// src/components/common/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-indigo-700 text-white transition-all duration-300 ease-in-out transform z-20 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="h-16 flex items-center justify-between pl-6 pr-3 border-b border-indigo-800">
        {isOpen ? (
          <h1 className="text-xl font-bold">DocCollab</h1>
        ) : (
          <h1 className="text-xl font-bold">DC</h1>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none"
        >
          <span className="sr-only">Toggle sidebar</span>
          {isOpen ? (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="mt-6 px-3 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive('/dashboard')
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            <svg
              className={`h-6 w-6 ${isOpen ? 'mr-3' : 'mx-auto'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {isOpen && <span>Dashboard</span>}
          </Link>
          
          <Link
            to="/documents"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive('/documents')
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            <svg
              className={`h-6 w-6 ${isOpen ? 'mr-3' : 'mx-auto'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isOpen && <span>Documents</span>}
          </Link>
          
          <Link
            to="/analytics"
            className={`flex items-center px-3 py-2 rounded-md ${
              isActive('/analytics')
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            <svg
              className={`h-6 w-6 ${isOpen ? 'mr-3' : 'mx-auto'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {isOpen && <span>Analytics</span>}
          </Link>
        </div>
        
        <div className="mt-10">
          <p className={`px-3 text-xs font-semibold text-indigo-300 uppercase tracking-wider ${!isOpen && 'text-center'}`}>
            {isOpen ? 'Quick Actions' : 'Actions'}
          </p>
          <div className="mt-2 space-y-2">
            <Link
              to="/documents/new"
              className="flex items-center px-3 py-2 rounded-md text-indigo-200 hover:bg-indigo-600 hover:text-white"
            >
              <svg
                className={`h-6 w-6 ${isOpen ? 'mr-3' : 'mx-auto'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {isOpen && <span>New Document</span>}
            </Link>
          </div>
        </div>
        
        {/* User profile section at bottom of sidebar */}
        <div className="mt-auto pt-10">
          <div className={`px-3 py-2 rounded-md ${isOpen ? 'flex items-center' : 'text-center'}`}>
            <div className={`h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium ${!isOpen && 'mx-auto'}`}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            {isOpen && (
              <div className="ml-3 flex-1 truncate">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <Link
            to="/profile"
            className={`mt-2 flex items-center px-3 py-2 rounded-md ${
              isActive('/profile')
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            <svg
              className={`h-6 w-6 ${isOpen ? 'mr-3' : 'mx-auto'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {isOpen && <span>Settings</span>}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;