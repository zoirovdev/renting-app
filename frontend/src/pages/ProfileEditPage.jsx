import { useEffect, useState } from "react"
import { useUserStore } from "../stores/useUserStore.js"
import { useRentadStore } from "../stores/useRentadStore.js"
import { MapPin, Wallet, DollarSign, BedDouble, Copy, Check } from "lucide-react"
import { Link, useParams } from "react-router-dom"


const ProfileEditPage = () => {
    const { currentUser } = useUserStore()
    const { rentads, getByUserId, loading } = useRentadStore()
    const [copied, setCopied] = useState(false)


    const loadingRentads = [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 },
        { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 },
    ]


    const copyPhone = async () => {
        try {
            if(currentUser){
                await navigator.clipboard.writeText(currentUser?.phone)
                setCopied(true)
                setTimeout(() => setCopied(false), 3000)
            }
        } catch (err) {
            console.log("Error in copyPhone in ProfilePage", err)
        }
    }

    useEffect(() => {
        if(currentUser){
            getByUserId(currentUser?.id)
            // console.log(rentads)
            console.log(1)
        }
    }, [getByUserId, currentUser])


    return (
        <div className='flex flex-col items-center gap-4 md:gap-8 py-4 md:py-8 px-4 md:px-0 pb-20 md:pb-8'>
            <div className="w-full max-w-[600px] py-4 px-4 md:px-6 space-y-4">
                <div className="flex flex-col justify-center items-center
                    border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl py-4 md:py-6 gap-2">
                    <div className="flex flex-row justify-start items-center gap-2 text-lg md:text-xl tracking-wider
                        dark:text-gray-100">
                        <p>{currentUser?.firstname}</p>
                        <p>{currentUser?.lastname}</p>
                    </div>
                    <p className="text-lime-600 dark:text-lime-500 text-lg md:text-xl">@{currentUser?.username}</p>
                    <div className='flex flex-row justify-center items-center gap-2 dark:text-gray-100
                        cursor-pointer py-2 px-4 rounded-xl dark:hover:bg-gray-800 hover:bg-gray-100 text-sm md:text-base'
                        onClick={copyPhone}>
                        {copied 
                        ? <Check className='w-4 h-4 text-lime-500'/>
                        : <Copy className='w-4 h-4 text-gray-400'/>}
                        <p>{currentUser?.phone}</p>
                    </div>
                    <p className="dark:text-gray-100 text-xs md:text-sm text-center px-4">
                        <span className="text-gray-500 dark:text-gray-400">since </span>
                        {new Date(currentUser?.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4 w-full">
                <div className="flex justify-center items-center">
                    <p className="text-base md:text-lg font-semibold tracking-widest dark:text-slate-100">Posted ads</p>
                </div>
                {loading 
                    ? <div className='flex flex-wrap justify-center md:justify-start items-center gap-4 md:px-[110px]'>
                        {loadingRentads.map(load => (
                            <div key={load.id} 
                            className='flex flex-col justify-start w-full sm:w-[calc(50%-0.5rem)] lg:w-[300px] h-[400px] gap-1 pb-4 animate-pulse'>
                            {/* Image skeleton */}
                            <div className='w-full h-[200px] bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                            
                            {/* Content skeleton */}
                            <div className='grid grid-cols-1 py-2 px-4 gap-2'>
                                <div className='flex justify-between items-center'>
                                <div className='flex flex-col gap-2'>
                                    <div className='h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                    <div className='h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                    <div className='h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                </div>
                                </div>
                                
                                {/* Location skeleton */}
                                <div className="flex flex-row justify-start items-center gap-2 w-full">
                                <div className='w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                <div className='h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                </div>
                                
                                {/* Offers skeleton */}
                                <div className='flex flex-wrap gap-1'>
                                <div className='h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                                <div className='h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                                <div className='h-6 w-14 bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    : rentads.length === 0
                    ? <div className='flex flex-col justify-center items-center md:px-[110px] mt-10 md:mt-20'>
                        <div className='text-gray-400 dark:text-gray-500 text-center'>
                        <p className='text-6xl mb-4'>🏠</p>
                        <p className='text-xl font-semibold mb-2'>No properties found</p>
                        <p className='text-gray-500 dark:text-gray-400'>You haven't posted any ads yet</p>
                        </div>
                    </div>
                    : <div className='flex flex-wrap justify-center md:justify-start items-center gap-4 md:px-[110px]'>
                        {rentads.length && rentads.map((rentad) => (
                        <Link to={`/edit-detail/${rentad.id}`} key={rentad.id} 
                            className='flex flex-col justify-start w-full sm:w-[calc(50%-0.5rem)] lg:w-[300px] h-[400px] gap-1 pb-4'>
                            {rentad.images.length && 
                            <div className='w-full'>
                            <img src={rentad.images[0]} alt="" className='object-cover w-full h-[200px] rounded-xl'/>  
                            </div>}
                            <div className='grid grid-cols-1 py-2 px-4 gap-2'>
                            <div className='flex justify-between items-center'>
                                <div className='flex flex-col'>
                                <p className='font-semibold tracking-wider dark:text-slate-50 text-sm md:text-base'>{rentad.property}</p>
                                <p className='dark:text-slate-50 text-xs md:text-sm'>{rentad.bedrooms} <span className='text-gray-500 dark:text-slate-300'>{rentad.bedrooms > 1 ? "rooms" : "room"}</span> • {rentad.bathrooms} <span className='text-gray-500 dark:text-slate-300'>{rentad.bathrooms > 1 ? "baths" : "bath"}</span></p>
                                </div>
                                <div className='flex flex-col dark:text-slate-50'>
                                <p className='text-lime-500 text-sm md:text-base'>{rentad.rent_currency}{(rentad.rent).toString().split('.')[0]}</p>
                                <p className='dark:text-slate-300 text-xs md:text-sm'>{rentad.rent_period}</p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-start items-center gap-2 w-full">
                                <MapPin className='w-4 h-4 text-orange-600'/>
                                <p className='dark:text-slate-50 text-xs md:text-sm'>{rentad.location_display}</p>
                            </div>
                            <div className='flex flex-wrap gap-1'>
                                {rentad.offers && rentad.offers.slice(0, 4).map(offer => (
                                <p key={offer} 
                                    className="border border-blue-400 rounded-xl px-2 text-xs md:text-sm text-gray-600
                                    dark:text-slate-300">
                                    {offer}
                                </p>
                                ))}
                                {rentad.offers.length > 4 && (
                                <p className="border border-blue-400 rounded-xl px-2 text-xs md:text-sm text-gray-600
                                    dark:text-slate-300">
                                    +{rentad.offers.length - 4} more
                                </p>
                                )}
                            </div>
                            </div>
                        </Link>
                        ))}
                    </div>}
            </div>
        </div>
    )
}

export default ProfileEditPage