import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all project metrics from port 9005
        axios.get('http://localhost:9005/projects') 
            .then((res) => {
                setProjects(res.data || []);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load dashboard metrics');
                setLoading(false);
            });
    }, []);

    // Structural calculations for metrics cards
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((acc, curr) => acc + (curr.task?.length || 0), 0);

    return (
        <div className="p-8 w-full max-w-7xl mx-auto font-sans antialiased bg-slate-50/30 min-h-screen">
            {/* --- HEADER SECTION --- */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Overview Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time workspace pipeline monitoring & production metrics.</p>
                </div>
                <div className="flex items-center">
                    <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live Core Connected
                    </span>
                </div>
            </div>

            {/* --- METRICS COUNTER GRID CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Card 1: Total Projects */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-5 transition-transform hover:-translate-y-0.5 duration-200">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Boards</p>
                        <h3 className="text-3xl font-black text-slate-800 mt-0.5">{loading ? '...' : totalProjects}</h3>
                    </div>
                </div>

                {/* Card 2: Total Backlog Tasks */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-5 transition-transform hover:-translate-y-0.5 duration-200">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shadow-inner">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Active Tasks</p>
                        <h3 className="text-3xl font-black text-slate-800 mt-0.5">{loading ? '...' : totalTasks}</h3>
                    </div>
                </div>
            </div>

            {/* --- MAIN WORKSPACE LISTING SHOWCASE --- */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <h3 className="font-bold text-slate-800 text-base tracking-tight">Your Tracked Workspaces</h3>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-slate-400 font-medium animate-pulse">Syncing tracking pipelines...</div>
                ) : projects.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <p className="font-semibold text-slate-700">No projects available yet.</p>
                        <p className="text-sm text-slate-400 mt-1">Use the sidebar add button to spin up a new collaboration workspace.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {projects.map((proj) => (
                            <div key={proj._id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="font-extrabold text-slate-800 text-lg capitalize tracking-tight">{proj.title}</h4>
                                    {proj.description && (
                                        <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl">{proj.description}</p>
                                    )}
                                    <p className="text-slate-400 text-xs flex items-center gap-1.5 pt-0.5">
                                        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16"/></svg>
                                        Contains <span className="text-indigo-600 font-bold">{(proj.task || []).length}</span> workflow items inside production board pipelines.
                                    </p>
                                </div>
                                <div className="flex items-center sm:justify-end shrink-0">
                                    <Link 
                                        to={`/project/${proj._id}`}
                                        className="inline-flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-bold text-sm py-2.5 px-5 rounded-xl border border-indigo-200/50 transition-all shadow-sm group"
                                    >
                                        <span>Enter Board</span>
                                        <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;