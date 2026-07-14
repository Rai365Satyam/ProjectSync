import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AppLayout = ({ children }) => {
    return (
        <div className='w-screen h-screen flex bg-slate-50 overflow-hidden'>
            {/* Sidebar now goes completely from top to bottom */}
            <div className="w-[256px] shrink-0 h-full">
                <Sidebar />
            </div>

            {/* Right side area container holds the Navbar and the main body views */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Navbar sits cleanly on top of the content workspace */}
                <Navbar />
                
                {/* Main content viewport window scroll wrapper */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="w-full h-full flex">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppLayout
