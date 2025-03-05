// src/components/layouts/FullWidthLayout.tsx
import React from 'react';

interface FullWidthLayoutProps {
    children: React.ReactNode;
}

const FullWidthLayout: React.FC<FullWidthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    );
};

export default FullWidthLayout;