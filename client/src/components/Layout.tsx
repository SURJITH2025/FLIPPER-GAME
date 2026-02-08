import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-bg text-white relative overflow-x-hidden selection:bg-neon-pink/30">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(10,10,10,0.9),rgba(10,10,10,0.9)),linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Ambient Glows */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 w-full min-h-screen flex flex-col">
                {children}

                <footer className="mt-auto py-6 text-center text-gray-600 text-sm">
                    SYSTEM_ID: MEMORY_FLIP_V1.0 // POWERED BY REACT_CORE
                </footer>
            </div>
        </div>
    );
};

export default Layout;
