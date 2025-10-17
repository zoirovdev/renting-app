import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { House, Search, Plus, CircleUser, Settings } from "lucide-react"
import { useUserStore } from '../stores/useUserStore.js'
import { useTheme } from './ThemeProvider.jsx'

const Bar = () => {
    const location = useLocation()
    const page = location.pathname
    const navigate = useNavigate()
    const { currentUser } = useUserStore()

    return (
        <>
            {/* Desktop Bar - Top */}
            <div className="hidden md:block sticky top-0 left-0 right-0 z-50 dark:bg-gray-900 bg-white">
                <div className="flex flex-row justify-center items-center dark:bg-gray-900 relative py-4">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50 tracking-wider
                        hover:text-gray-700 absolute left-8 cursor-pointer"
                        onClick={() => navigate("/")}>
                        rented.com
                    </p>
                    <div className='flex justify-center items-center bg-gray-100 rounded-xl p-1 dark:bg-slate-800'>
                        <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-xl
                            py-2 px-4
                            ${page === "/" ? "bg-white dark:bg-gray-600 dark:text-gray-50 shadow-xl" : "text-gray-500 dark:text-gray-300"}`}
                            onClick={() => {navigate("/");}}>
                            <p>Home</p>
                        </div>
                        <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-xl
                            py-2 px-4
                            ${page === "/search" ? "bg-gray-50 dark:bg-gray-600 dark:text-gray-50 shadow-xl" : "text-gray-500 dark:text-gray-300"}`}
                            onClick={() => {navigate("/search")}}>
                            <p>Search</p>
                        </div>
                        <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-xl
                            py-2 px-4
                            ${page === "/add" ? "bg-gray-50 dark:bg-gray-600 dark:text-gray-50 shadow-xl" : "text-gray-500 dark:text-gray-300"}`}
                            onClick={() => navigate("/add")}>
                            <p>Add</p>
                        </div>
                    </div>
                    <div className='absolute right-8 flex justify-center items-center p-1 gap-1'>
                        <Link to={`/profile`} className={`rounded-xl py-2 px-3.5 bg-black dark:bg-gray-700 text-gray-50 place-content-center`}>
                            <span className=''>{currentUser?.firstname[0].toUpperCase()}</span>
                        </Link>
                        <Link to={'/settings'} className={`rounded-xl p-2.5 border border-gray-200 dark:border-none dark:bg-gray-800`}>
                            <Settings className='w-5 h-5 dark:text-gray-50'/>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Top Bar */}
            <div className="md:hidden sticky top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-row justify-between items-center py-3 px-4">
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-50 tracking-wider cursor-pointer"
                        onClick={() => navigate("/")}>
                        rented.com
                    </p>
                    <div className='flex justify-center items-center gap-2'>
                        <Link to={"/profile"} className={`rounded-xl py-2 px-3 bg-black dark:bg-gray-700 text-gray-50 flex items-center justify-center`}>
                            <span className='text-sm'>{currentUser?.firstname[0].toUpperCase()}</span>
                        </Link>
                        <Link to={'/settings'} className={`rounded-xl p-2 border border-gray-200 dark:border-none dark:bg-gray-800`}>
                            <Settings className='w-5 h-5 dark:text-gray-50'/>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-row justify-around items-center py-2 px-2">
                    <div className={`flex flex-col justify-center items-center gap-1 cursor-pointer rounded-xl
                        py-2 px-3
                        ${page === "/" ? "text-gray-900 dark:text-gray-50" : "text-gray-400 dark:text-gray-500"}`}
                        onClick={() => {navigate("/");}}>
                        <House className='w-5 h-5'/>
                        <p className='text-xs'>Home</p>
                    </div>
                    <div className={`flex flex-col justify-center items-center gap-1 cursor-pointer rounded-xl
                        py-2 px-3
                        ${page === "/search" ? "text-gray-900 dark:text-gray-50" : "text-gray-400 dark:text-gray-500"}`}
                        onClick={() => {navigate("/search")}}>
                        <Search className="w-5 h-5"/>
                        <p className='text-xs'>Search</p>
                    </div>
                    <div className={`flex flex-col justify-center items-center gap-1 cursor-pointer rounded-xl
                        py-2 px-3
                        ${page === "/add" ? "text-gray-900 dark:text-gray-50" : "text-gray-400 dark:text-gray-500"}`}
                        onClick={() => navigate("/add")}>
                        <Plus className="w-5 h-5"/>
                        <p className='text-xs'>Add</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Bar