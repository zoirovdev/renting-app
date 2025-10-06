import React from 'react'

const SettingsPage = () => {
    return (
        <div className='flex justify-start items-center py-[60px] pl-16'>
            <div className='w-[800px]'>
                <div className='flex justify-between items-center w-[600px] border-l border-gray-200 py-2 px-4'>                    
                    <p>App theme</p>
                    <button className='bg-gray-200 rounded-[10px] py-1 px-4'>Light</button>
                </div>
                <div className='flex justify-between items-center w-[600px] border-y border-l border-gray-200 py-2 px-4'>                    
                    <p>Account password</p>
                    <button className='bg-gray-200 rounded-[10px] py-1 px-4'>Change</button>
                </div>
                <div className='flex justify-between items-center w-[600px] border-l border-gray-200 py-2 px-4'>                    
                    <p>Delete account</p>
                    <button className='bg-gray-200 rounded-[10px] py-1 px-4'>Log out</button>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
