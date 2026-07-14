import React, { useCallback, useEffect, useState } from 'react'
import AddProjectModal from './AddProjectModal'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const [isModalOpen, setModalState] = useState(false)
  const [projects, setProjects] = useState([])
  const [paramsWindow, setParamsWindow] = useState(window.location.pathname.slice(1))

  // Retrieve user data securely saved in localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', email: '' };

  const handleLocation = (e) => {
    setParamsWindow(new URL(e.currentTarget.href).pathname.slice(1))
  }

  const openModal = useCallback(() => {
    setModalState(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalState(false)
  }, [])

  const projectData = () => {
    axios.get('https://projectsync-eslx.onrender.com/projects/')
      .then((res) => {
        setProjects(res.data)
      })
  }

  useEffect(() => {
    projectData()
    document.addEventListener('projectUpdate', ({ detail }) => {
      projectData()
    })
    return () => {
      document.removeEventListener('projectUpdate', {}, false)
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className='bg-slate-900 text-slate-200 w-64 min-h-screen flex flex-col justify-between border-r border-slate-800 font-sans antialiased'>
      {/* Top Section */}
      <div>
        {/* Sidebar Header Title */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/" className="text-xl font-bold tracking-wider text-indigo-400">⚡ ProjectSync</Link>
        </div>

        {/* Projects Section Header */}
        <div className="px-6 py-4 flex items-center justify-between text-slate-400 uppercase tracking-wider text-xs font-bold">
          <span>Projects</span>
          <button onClick={openModal} className='bg-indigo-600 hover:bg-indigo-500 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
              <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dynamic Project Links List */}
        <nav className="px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {projects.map((project, index) => {
            const isActive = paramsWindow === project._id || paramsWindow === `project/${project._id}`;
            return (
              <Link key={index} to={`/project/${project._id}`} onClick={(e) => handleLocation(e)} className="block">
                <div className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl font-medium transition-all select-none capitalize ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}>
                  <svg className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                  <span className="truncate text-sm">{project.title}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Profile Footer Panel */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase shrink-0">
            {user.name.slice(0, 2)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold truncate text-slate-100">{user.name}</h4>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer text-slate-300"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

      <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  )
}

export default Sidebar