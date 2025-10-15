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
        <div className='flex flex-col justify-center items-center py-8'>
            <div className='w-[700px] flex flex-col justify-center items-center gap-8'>
                <div className="flex justify-start items-center w-[600px]">
                    <p className="text-2xl font-bold tracking-wider dark:text-gray-50">Settings</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className='flex flex-col gap-2 w-[600px] 
                        p-4 border-b border-gray-200 dark:border-gray-700'>  
                        <p className="text-gray-400 text-lg tracking-wider">Appearance</p>                
                        <div className='flex flex-row justify-between items-center'>
                            <p className="dark:text-gray-100">Switch theme</p>
                            <button onClick={toggleTheme}
                                className='bg-gray-900 dark:bg-gray-100 text-gray-50 dark:text-gray-900 
                                rounded-xl py-2 px-4 cursor-pointer'>
                                {isDark ? 'Dark' : 'Light'}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 w-[600px] p-4'>
                        <p className='text-gray-400 text-lg tracking-wider'>Account</p>
                        <div className="flex flex-col border-b border-gray-200 pb-4
                            dark:border-gray-700 gap-2">
                            <p className="dark:text-gray-50">Update Profile Info</p>
                            <div className='flex gap-2'>
                                <div className='flex flex-col basis-1/2'>
                                    <label htmlFor="firstname" 
                                        className='text-gray-400'>
                                        Firstname
                                    </label>
                                    <input type="text" 
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        className="border border-gray-200 dark:border-gray-700 dark:text-gray-50 py-2 px-4 rounded-xl"/>
                                </div>
                                <div className="flex flex-col basis-1/2">
                                    <label className='text-gray-400'>
                                        Lastname
                                    </label>
                                    <input type="text" 
                                        placeholder="Lastname"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className="border border-gray-200 dark:border-gray-700 dark:text-gray-50 py-2 px-4 rounded-xl"/>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor=""
                                    className='text-gray-400'>
                                    Username
                                </label>
                                <input type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="border border-gray-200 dark:border-gray-700 dark:text-gray-50 py-2 px-4 rounded-xl"/>
                            </div>
                            <div className="flex flex-row-reverse">
                                <button className="bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 py-2 px-4 rounded-xl"
                                    onClick={handleProfileInfo}>
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col pb-4 border-b border-gray-200
                            dark:border-gray-700 gap-2'>                    
                            <p className="dark:text-gray-100">Update current password</p>
                            <input type="password"
                                id="currentPassword"
                                placeholder='current password'
                                onChange={(e) => { setCurrentPassword(e.target.value) }}
                                className='border border-gray-200 dark:border-gray-700 focus:outline-1 focus:outline-lime-500 rounded-xl 
                                dark:text-gray-100 py-2 px-4'/>
                            <input type="password"
                                id="newPassword"
                                placeholder='new password'
                                onChange={(e) => { setNewPassword(e.target.value) }}
                                className='border border-gray-200 dark:border-gray-700 focus:outline-1 focus:outline-lime-500 rounded-xl 
                                dark:text-gray-100 py-2 px-4'/>
                            <div className='flex flex-row-reverse'>
                                <button className='bg-gray-900 dark:bg-gray-100 text-gray-50 dark:text-gray-900 
                                    rounded-xl py-2 px-4 cursor-pointer'
                                    onClick={handlePassword}>
                                    Change
                                </button>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>                    
                            <p className="dark:text-gray-100">Log out your current account</p>
                            <button className='bg-red-700 hover:bg-red-800 text-gray-50 rounded-xl py-2 px-4 cursor-pointer'
                                onClick={logout}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
