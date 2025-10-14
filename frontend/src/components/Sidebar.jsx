import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { House, Search, Plus, CircleUser, Settings } from "lucide-react"
import { useUserStore } from '../stores/useUserStore.js'
import { useTheme } from './ThemeProvider.jsx'




const Sidebar = () => {
    const location = useLocation()
    const page = location.pathname
    const navigate = useNavigate()
    const { currentUser } = useUserStore()


    return (
        <div className="sticky top-0 left-0 right-0 z-50 dark:bg-slate-900">
            <div className="flex flex-row justify-center items-center dark:bg-slate-900">
                <p className="text-2xl font-semibold text-gray-900 dark:text-slate-50 hover:text-gray-700 absolute top-4 left-8 py-2 px-4">rented.com</p>
                <div className='flex justify-center items-center bg-gray-100 rounded-full p-1 dark:bg-slate-800
                    absolute top-4'>
                    <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-full
                        py-2 px-4
                        ${page === "/" ? "bg-white dark:bg-slate-600 dark:text-slate-50 shadow-md" : "text-gray-500 dark:text-slate-300"}`}
                        onClick={() => {navigate("/");}}>
                        {/* <House className='w-5 h-5'/> */}
                        <p>Home</p>
                    </div>
                    <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-full
                        py-2 px-4
                        ${page === "/search" ? "bg-white dark:bg-slate-600 dark:text-slate-50 shadow-md" : "text-gray-500 dark:text-slate-300"}`}
                        onClick={() => {navigate("/search")}}>
                        {/* <Search className="w-5 h-5"/> */}
                        <p>Search</p>
                    </div>
                    <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-full
                        py-2 px-4
                        ${page === "/add" ? "bg-white dark:bg-slate-600 dark:text-slate-50 shadow-md" : "text-gray-500 dark:text-slate-300"}`}
                        onClick={() => navigate("/add")}>
                        {/* <Plus className="w-5 h-5"/> */}
                        <p>Add</p>
                    </div>
                </div>
                <div className='absolute right-16 top-4 flex justify-center items-center p-1 gap-1'>
                    <Link to={"/profile"} className={`rounded-full py-2 px-3.5 bg-black dark:bg-slate-700 text-white place-content-center`}>
                        <span className=''>{currentUser?.firstname[0].toUpperCase()}</span>
                    </Link>
                    <Link to={'/settings'} className={`rounded-full p-2.5 border border-gray-200 dark:border-none dark:bg-slate-800`}>
                        <Settings className='w-5 h-5 dark:text-slate-50'/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar