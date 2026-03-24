import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="container max-w-5xl w-full relative z-10 flex flex-col items-center">
            {children}
        </div>
    );
};

export default Layout;
