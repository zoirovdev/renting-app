import { useEffect } from "react"
import { useUserStore } from "../stores/useUserStore.js"
import { useRentadStore } from "../stores/useRentadStore.js"
import { MapPin, Wallet, DollarSign, BedDouble } from "lucide-react"
import { Link } from "react-router-dom"


const ProfilePage = () => {
    const { currentUser } = useUserStore()
    const { rentads, fetchRentads } = useRentadStore()

    useEffect(() => {
        fetchRentads()
    }, [fetchRentads])


    console.log(currentUser)
    return (
        <div className='flex justify-start items-center pl-[100px] pt-[50px]'>
            <div>
                <div className="flex justify-start items-center">
                    <p className="text-lg font-semibold tracking-widest">Profile info</p>
                </div>
                <div className="w-[600px] border-l border-gray-200 py-4 px-6 font-serif">
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-2">
                        <label className="text-gray-500">Username</label>
                        <p>{currentUser?.username}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-2">
                        <label className="text-gray-500">Firstname</label>
                        <p>{currentUser?.firstname}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-2">
                        <label className="text-gray-500">Lastname</label>
                        <p>{currentUser?.lastname}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-2">
                        <label className="text-gray-500">Phone</label>
                        <p>{currentUser?.phone}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center py-2">
                        <label className="text-gray-500">Joined at</label>
                        <p>{new Date(currentUser?.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex justify-start items-center">
                    <p className="text-lg font-semibold tracking-widest">Posted ads</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {rentads && rentads.map(rentad => (
                        <Link to={`/detail/${rentad.id}`} key={rentad.id} className='flex flex-col justify-start h-[370px] w-[370px]'>
                            {rentad.images.length && 
                            <div className='w-full'>
                                <img src={rentad.images[0]} alt="" className='object-cover w-[370px] h-[200px]'/>  
                            </div>}
                            <ul className='ml-4 mt-2 mb-4 space-y-2 font-serif'>
                                <li className='flex gap-2'>
                                    <p className='flex justify-center items-center'><MapPin className='w-4 h-4'/></p>
                                    <p>{rentad.property} in {rentad.location}</p>            
                                </li>  
                                <li className='flex gap-2'>
                                    <p className='flex justify-center items-center'><Wallet className="w-4 h-4"/></p>
                                    <p className='flex justify-center items-center'>{rentad.rent} <DollarSign className='w-4 h-4'/> per month</p>
                                </li>
                                <li className='flex gap-2'>
                                    <p className='flex justify-center items-center'><BedDouble className='w-4 h-4'/></p>
                                    <p>has {rentad.bedrooms} rooms</p>
                                </li>
                            </ul>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
