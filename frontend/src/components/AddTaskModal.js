import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import BtnPrimary from './BtnPrimary'
import BtnSecondary from './BtnSecondary'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddTaskModal = ({ isAddTaskModalOpen, setAddTaskModal, projectId = null, taskId = null, edit = false, refreshData }) => {

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('');

    useEffect(() => {
        if (edit && isAddTaskModalOpen) {
            axios.get(`https://projectsync-eslx.onrender.com/project/${projectId}/task/${taskId}`)
                .then((res) => {
                    if (res.data && res.data[0] && res.data[0].task && res.data[0].task[0]) {
                        setTitle(res.data[0].task[0].title)
                        setDesc(res.data[0].task[0].description || '')
                    }
                })
                .catch(() => {
                    toast.error('Something went wrong')
                })
        }
    }, [isAddTaskModalOpen, edit, projectId, taskId]);

    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = { title, description: desc };

        if (!edit) {
            axios.post(`https://projectsync-eslx.onrender.com/project/${projectId}/task`, payload)
                .then(() => {
                    setAddTaskModal(false)
                    toast.success('Task created successfully')
                    setTitle('')
                    setDesc('')
                    refreshData(true) 
                })
                .catch((error) => {
                    toast.error(error.response?.data?.message || 'Something went wrong')
                })
        } else {
            axios.put(`https://projectsync-eslx.onrender.com/project/${projectId}/task/${taskId}`, payload)
                .then(() => {
                    setAddTaskModal(false)
                    toast.success('Task updated successfully')
                    refreshData(true)
                    setTitle('')
                    setDesc('')
                })
                .catch((error) => {
                    toast.error(error.response?.data?.message || 'Something went wrong')
                })
        }
    }

    const handleClose = () => {
        setAddTaskModal(false);
        if (!edit) {
            setTitle('');
            setDesc('');
        }
    }

    return (
        <Transition appear show={isAddTaskModalOpen} as={Fragment}>
            <Dialog as='div' open={isAddTaskModalOpen} onClose={handleClose} className="relative z-50">
                <div className="fixed inset-0 overflow-y-auto">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="rounded-md bg-white w-6/12 shadow-xl overflow-hidden">
                                <Dialog.Title as='div' className={'bg-white shadow px-6 py-4 rounded-t-md relative flex items-center justify-between z-10'}>
                                    {!edit ? (<h1 className="font-bold text-gray-800 text-lg">Add Task</h1>) : (<h1 className="font-bold text-gray-800 text-lg">Edit Task</h1>)}
                                    <button type="button" onClick={handleClose} className='text-gray-500 hover:bg-gray-100 rounded p-1 transition-colors focus:outline-none focus:ring focus:ring-offset-1 focus:ring-indigo-200 '>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                                    </button>
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className='gap-4 px-8 py-4'>
                                    <div className='mb-3'>
                                        <label htmlFor="title" className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>User Name</label>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' placeholder='Enter user name' required />
                                    </div>
                                    <div className='mb-4'>
                                        <label htmlFor="Description" className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1'>Task to do</label>
                                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className='border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400' rows="5" placeholder='Task description details (optional)'></textarea>
                                    </div>
                                    <div className='flex justify-end items-center space-x-2 pt-2 border-t border-gray-100'>
                                        <BtnSecondary type="button" onClick={handleClose}>Cancel</BtnSecondary>
                                        <BtnPrimary type="submit">Save</BtnPrimary>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default AddTaskModal;