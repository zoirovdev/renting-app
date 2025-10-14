import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeProvider.jsx'



const SettingsPage = () => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <div className='flex flex-col justify-center items-center py-8'>
            <div className='w-[700px] flex flex-col justify-center items-center gap-8'>
                <div className="flex justify-start items-center w-[600px]">
                    <p className="text-2xl font-bold tracking-wider">Settings</p>
                </div>
                <div className="border border-slate-200 rounded-sm">
                    <div className='flex flex-col gap-2 w-[600px] 
                        p-4 border-b border-slate-200'>  
                        <p className="text-slate-400 text-lg tracking-wider">Appearance</p>                
                        <div className='flex flex-row justify-between items-center'>
                            <p>Switch theme</p>
                            <button onClick={toggleTheme}
                            className='bg-black text-white dark:text-white rounded-[10px] py-1 px-4'>
                                {isDark ? 'Dark' : 'Light'}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 w-[600px] p-4'>
                        <p className='text-slate-400 text-lg tracking-wider'>Account</p>
                        <div className='flex justify-between items-center pb-4 border-b border-slate-200'>                    
                            <p className="">Update current password</p>
                            <button className='bg-black text-white rounded-[10px] py-1 px-4'>Change</button>
                        </div>
                        <div className='flex justify-between items-center'>                    
                            <p>Log out your current account</p>
                            <button className='bg-red-600 text-white rounded-[10px] py-1 px-4'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
