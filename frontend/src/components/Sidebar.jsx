import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { House, Search, Plus, CircleUser, Settings } from "lucide-react"
import { useUserStore } from '../stores/useUserStore.js'




const Sidebar = () => {
    const location = useLocation()
    const page = location.pathname
    const navigate = useNavigate()
    const { currentUser } = useUserStore()

    console.log(page)
    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="flex flex-row justify-center items-center">
                <p className="text-2xl font-semibold text-gray-900 hover:text-gray-700 absolute top-4 left-8 py-2 px-4">rented.com</p>
                <div className='flex justify-center items-center bg-gray-100 rounded-full p-1
                    absolute top-4'>
                    <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-full
                        py-2 px-4
                        ${page === "/" ? "bg-white shadow-md" : "text-gray-500"}`}
                        onClick={() => {navigate("/");}}>
                        {/* <House className='w-5 h-5'/> */}
                        <p>Home</p>
                    </div>
                    <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-full
                        py-2 px-4
                        ${page === "/search" ? "bg-white shadow-md" : "text-gray-500"}`}
                        onClick={() => {navigate("/search")}}>
                        {/* <Search className="w-5 h-5"/> */}
                        <p>Search</p>
                    </div>
                    <div className={`text-medium flex justify-center items-center gap-2 cursor-pointer rounded-full
                        py-2 px-4
                        ${page === "/add" ? "bg-white shadow-md" : "text-gray-500"}`}
                        onClick={() => navigate("/add")}>
                        {/* <Plus className="w-5 h-5"/> */}
                        <p>Add</p>
                    </div>
                </div>
                <Link to={"/profile"} className='absolute right-16 top-4 py-2 px-4'>
                    <span className="bg-lime-300 rounded-full py-[10px] px-[15px] text-medium">
                        {currentUser?.firstname[0].toUpperCase()}
                    </span>
                </Link>
                <Link to={"/settings"} className='absolute right-8 top-4 py-2 px-4'>
                    <Settings />
                </Link>
            </div>
        </div>
    )
}

export default Sidebar