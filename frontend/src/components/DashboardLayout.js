import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Retrieve user data securely saved in localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', email: '' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900">
            {/* --- SIDEBAR --- */}
            <aside className={`bg-slate-900 text-slate-200 w-64 min-h-screen transition-all duration-300 border-r border-slate-800 ${isSidebarOpen ? 'block' : 'hidden'} md:flex flex-col`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
                    <span className="text-xl font-bold tracking-wider text-indigo-400">⚡ ProjectSync</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 rounded-xl font-medium transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/></svg>
                        <span>Dashboard</span>
                    </Link>
                    
                    {/* Add more links below as you build views */}
                </nav>

                {/* Sidebar Footer User Info */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase">
                            {user.name.slice(0, 2)}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold truncate text-slate-100">{user.name}</h4>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN MAIN AREA --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar Header */}
                <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-8 z-10">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>

                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Live Connected
                        </span>
                    </div>
                </header>

                {/* Main Content Viewport Wrapper */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;