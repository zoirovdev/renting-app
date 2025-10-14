import { useEffect, useState } from "react"
import { useUserStore } from "../stores/useUserStore.js"
import { useRentadStore } from "../stores/useRentadStore.js"
import { MapPin, Wallet, DollarSign, BedDouble, Copy, Check } from "lucide-react"
import { Link } from "react-router-dom"


const ProfilePage = () => {
    const { currentUser } = useUserStore()
    const { rentads, getByUserId } = useRentadStore()
    const [copied, setCopied] = useState(false)

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
            console.log(rentads)
            console.log(1)
        }
    }, [getByUserId, currentUser])


    // console.log(currentUser)
    return (
        <div className='flex flex-col items-center gap-8 py-8'>
            <div className="w-[600px] py-4 px-6 space-y-4">
                <div className="flex flex-col justify-center items-center
                    border border-slate-200 shadow-xl rounded-xl py-6 gap-2">
                    <div className="flex flex-row justify-start items-center gap-2 text-xl tracking-wider
                        dark:text-slate-100">
                        <p>{currentUser?.firstname}</p>
                        <p>{currentUser?.lastname}</p>
                    </div>
                    <p className="text-lime-600 dark:text-lime-500 text-xl">@{currentUser?.username}</p>
                    <div className='flex flex-row justify-center items-center gap-2 dark:text-slate-100
                        cursor-pointer py-2 px-4 rounded-xl border border-gray-200 dark:border-slate-700'
                        onClick={copyPhone}>
                        {copied 
                        ? <Check className='w-4 h-4 text-lime-500'/>
                        : <Copy className='w-4 h-4 text-gray-400'/>}
                        <p>{currentUser?.phone}</p>
                    </div>
                    <p className="dark:text-slate-100">
                        <span className="text-slate-500">since </span>
                        {new Date(currentUser?.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <div className="flex justify-center items-center">
                    <p className="text-lg font-semibold tracking-widest dark:text-slate-100">Posted ads</p>
                </div>
                <div className='flex flex-wrap justify-start items-center gap-x-2 mx-[130px]'>
                    {rentads.length && rentads.map((rentad) => (
                    <Link to={`/detail/${rentad.id}`} key={rentad.id} 
                        className='flex flex-col justify-start  w-[300px] h-[400px] gap-1 pb-4'>
                        {rentad.images.length && 
                        <div className='w-full'>
                        <img src={rentad.images[0]} alt="" className='object-cover w-[300px] h-[200px] rounded-xl'/>  
                        </div>}
                        <div className='grid grid-cols-1 py-2 px-4 gap-2'>
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col'>
                            <p className='font-semibold tracking-wider dark:text-slate-50'>{rentad.property}</p>
                            <p className='dark:text-slate-50'>{rentad.bedrooms} <span className='text-gray-500 dark:text-slate-300'>{rentad.bedrooms > 1 ? "rooms" : "room"}</span> • {rentad.bathrooms} <span className='text-gray-500 dark:text-slate-300'>{rentad.bathrooms > 1 ? "baths" : "bath"}</span></p>
                            </div>
                            <div className='flex flex-col dark:text-slate-50'>
                            <p className='text-lime-500'>{rentad.rent_currency}{(rentad.rent).toString().split('.')[0]}</p>
                            <p className='dark:text-slate-300'>{rentad.rent_period}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2 w-full">
                            <MapPin className='w-4 h-4 text-orange-600'/>
                            <p className='dark:text-slate-50'>{rentad.location_display}</p>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            {rentad.offers && rentad.offers.slice(0, 4).map(offer => (
                                <p key={offer} 
                                    className="border border-blue-400 rounded-xl px-2 text-sm text-gray-600
                                        dark:text-slate-300">
                                    {offer}
                                </p>
                            ))}
                            {rentad.offers.length > 4 && (
                                <p className="border border-blue-400 rounded-xl px-2 text-sm text-gray-600
                                dark:text-slate-300">
                                +{rentad.offers.length - 4} more
                                </p>
                            )}
                        </div>
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
