import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeProvider.jsx'
import { useUserStore } from "../stores/useUserStore.js"



const SettingsPage = () => {
    const { isDark, toggleTheme } = useTheme()
    const { logout, changePassword, currentUser, error, updateProfile } = useUserStore()

    const [ currentPassword, setCurrentPassword ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')

    const [ firstname, setFirstname ] = useState('')
    const [ lastname, setLastname ] = useState('')
    const [ username, setUsername ] = useState('')

    useEffect(() => {
        if(currentUser){
            setFirstname(currentUser.firstname)
            setLastname(currentUser.lastname)
            setUsername(currentUser.username)
        }
    }, [currentUser])

    const handlePassword = async () => {
        if(currentUser && currentPassword && newPassword){
            await changePassword(currentPassword, newPassword)
        }
    }

    const handleProfileInfo = async () => {
        if(currentUser){
            await updateProfile(firstname, lastname, username)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center py-4 md:py-8 px-4 md:px-0 pb-20 md:pb-8'>
            <div className='w-full max-w-[700px] flex flex-col justify-center items-center gap-4 md:gap-8'>
                <div className="flex justify-start items-center w-full max-w-[600px]">
                    <p className="text-xl md:text-2xl font-bold tracking-wider dark:text-gray-50">Settings</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[600px]">
                    <div className='flex flex-col gap-2 w-full p-4 border-b border-gray-200 dark:border-gray-700'>  
                        <p className="text-gray-400 text-base md:text-lg tracking-wider">Appearance</p>                
                        <div className='flex flex-row justify-between items-center'>
                            <p className="dark:text-gray-100 text-sm md:text-base">Switch theme</p>
                            <button onClick={toggleTheme}
                                className='bg-gray-900 dark:bg-gray-100 text-gray-50 dark:text-gray-900 
                                rounded-xl py-2 px-4 cursor-pointer text-sm md:text-base'>
                                {isDark ? 'Dark' : 'Light'}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 w-full p-4'>
                        <p className='text-gray-400 text-base md:text-lg tracking-wider'>Account</p>
                        <div className="flex flex-col border-b border-gray-200 pb-4
                            dark:border-gray-700 gap-2">
                            <p className="dark:text-gray-50 text-sm md:text-base">Update Profile Info</p>
                            <div className='flex flex-col md:flex-row gap-2'>
                                <div className='flex flex-col w-full md:basis-1/2'>
                                    <label htmlFor="firstname" 
                                        className='text-gray-400 text-xs md:text-sm mb-1'>
                                        Firstname
                                    </label>
                                    <input type="text" 
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        className="border border-gray-200 dark:border-gray-700 dark:text-gray-50 
                                        py-2 px-4 rounded-xl text-sm md:text-base outline-none
                                        focus:ring-2 focus:ring-lime-500"/>
                                </div>
                                <div className="flex flex-col w-full md:basis-1/2">
                                    <label className='text-gray-400 text-xs md:text-sm mb-1'>
                                        Lastname
                                    </label>
                                    <input type="text" 
                                        placeholder="Lastname"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className="border border-gray-200 dark:border-gray-700 dark:text-gray-50 
                                        py-2 px-4 rounded-xl text-sm md:text-base outline-none
                                        focus:ring-2 focus:ring-lime-500"/>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor=""
                                    className='text-gray-400 text-xs md:text-sm mb-1'>
                                    Username
                                </label>
                                <input type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="border border-gray-200 dark:border-gray-700 dark:text-gray-50 
                                    py-2 px-4 rounded-xl text-sm md:text-base outline-none
                                    focus:ring-2 focus:ring-lime-500"/>
                            </div>
                            <div className="flex flex-row-reverse">
                                <button className="bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 
                                    py-2 px-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 
                                    transition-colors text-sm md:text-base"
                                    onClick={handleProfileInfo}>
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col pb-4 border-b border-gray-200
                            dark:border-gray-700 gap-2'>                    
                            <p className="dark:text-gray-100 text-sm md:text-base">Update current password</p>
                            <input type="password"
                                id="currentPassword"
                                placeholder='current password'
                                onChange={(e) => { setCurrentPassword(e.target.value) }}
                                className='border border-gray-200 dark:border-gray-700 
                                focus:outline-none focus:ring-2 focus:ring-lime-500 rounded-xl 
                                dark:text-gray-100 py-2 px-4 text-sm md:text-base'/>
                            <input type="password"
                                id="newPassword"
                                placeholder='new password'
                                onChange={(e) => { setNewPassword(e.target.value) }}
                                className='border border-gray-200 dark:border-gray-700 
                                focus:outline-none focus:ring-2 focus:ring-lime-500 rounded-xl 
                                dark:text-gray-100 py-2 px-4 text-sm md:text-base'/>
                            <div className='flex flex-row-reverse'>
                                <button className='bg-gray-900 dark:bg-gray-100 text-gray-50 dark:text-gray-900 
                                    rounded-xl py-2 px-4 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200 
                                    transition-colors text-sm md:text-base'
                                    onClick={handlePassword}>
                                    Change
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2'>                    
                            <p className="dark:text-gray-100 text-sm md:text-base">Log out your current account</p>
                            <button className='bg-red-700 hover:bg-red-800 text-gray-50 rounded-xl py-2 px-4 
                                cursor-pointer transition-colors text-sm md:text-base w-full md:w-auto'
                                onClick={logout}>
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage