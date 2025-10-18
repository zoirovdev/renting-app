import { useRentadStore } from '../stores/useRentadStore'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, X, CircleCheck, Copy, Check, Share } from 'lucide-react'
import { useLocationStore } from '../stores/useLocationStore'
import DetailMap from '../components/DetailMap'
import { useUserStore } from '../stores/useUserStore'



const DetailPage = () => {
    const { fetchRentad, currentRentad, loading } = useRentadStore()
    const { id } = useParams()
    const { getLocation, currentLocation, setCurrentLocation } = useLocationStore()
    const navigate = useNavigate()

    const [imagesModal, setImagesModal] = useState(false) 
    const [currentIndex, setCurrentIndex] = useState(0)
    const [copied, setCopied] = useState(false)
    const [shareCopied, setShareCopied] = useState(false)
    const [isOpenShare, setIsOpenShare] = useState(false)



    const handleShare = async () => {
        try {
            const shareUrl = window.location.origin + window.location.pathname;
            await navigator.clipboard.writeText(shareUrl)
            setShareCopied(true)
            setTimeout(() => setShareCopied(false), 3000)
        } catch (err) {
            console.log("Failed to copy", err)
        }
    }

    const handleCopy = async () => {
        try {
            if(currentRentad?.user_phone)
            {
                await navigator.clipboard.writeText(currentRentad.user_phone)
                setCopied(true)
                setTimeout(() => setCopied(false), 3000)
            }
        } catch (err) {
            console.log("Failed to copy", err)
        }
    }

    const goNext = () => {
        if (currentRentad?.images && currentIndex < currentRentad.images.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }
    
    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }



    useEffect(() => {
        setCurrentIndex(0)
        fetchRentad(id)
    }, [id])

    useEffect(() => {
        if (currentRentad?.location_id) {
            getLocation(currentRentad.location_id)
        }
    }, [currentRentad?.location_id])


   
    return (
        <div className="flex justify-center items-center px-4 md:px-0 pb-20 md:pb-8">
            
        { loading
            ?   <div className={`${imagesModal ? "hidden" : ""} animate-pulse w-full max-w-[800px]`}>
                {/* Image skeleton */}
                <div className="flex flex-col justify-center w-full h-[300px] md:h-[500px] relative">
                    <div className='bg-gray-300 dark:bg-gray-700 w-full h-full rounded-xl'></div>
                    <div className='absolute bottom-2 right-2 bg-gray-300 dark:bg-gray-700 py-2 px-4 
                        rounded-xl z-20 w-24 md:w-32 h-8 md:h-10'>
                    </div>
                </div>

                {/* Details header skeleton */}
                <div className='flex justify-between items-center mt-4 md:mt-8 mb-1'>
                    <div className='h-6 md:h-7 w-20 md:w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
                    <div className='h-8 md:h-9 w-20 md:w-24 bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                </div>

                {/* Details card skeleton */}
                <div className="flex flex-col pl-4 pr-2 pb-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 md:mb-8">
                    <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
                        <div className='flex flex-col gap-2 py-4'>
                            <div className='flex flex-col md:flex-row md:items-center gap-2'>
                                <div className='h-5 md:h-6 w-32 md:w-40 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                <div className='h-4 md:h-5 w-16 md:w-20 bg-gray-300 dark:bg-gray-700 rounded'></div>
                            </div>
                            <div className='flex flex-col md:flex-row gap-2'>
                                <div className='h-4 md:h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                <div className='hidden md:block h-5 w-3 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                                <div className='h-4 md:h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
                                <div className='hidden md:block h-5 w-3 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                                <div className='h-4 md:h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
                            </div>
                        </div>
                        <div className='h-16 md:h-20 w-28 md:w-32 bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                    </div>
                    
                    {/* Offers skeleton */}
                    <div className='flex flex-wrap gap-2 pt-2'>
                        <div className='flex justify-center items-center gap-1'>
                            <div className='w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                            <div className='h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded'></div>
                        </div>
                        <div className='flex justify-center items-center gap-1'>
                            <div className='w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                            <div className='h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded'></div>
                        </div>
                        <div className='flex justify-center items-center gap-1'>
                            <div className='w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                            <div className='h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
                        </div>
                    </div>
                </div>

                {/* Location skeleton */}
                <div className='flex flex-row flex-wrap gap-1 mb-1'>
                    <div className='h-6 md:h-7 w-6 md:w-8 bg-gray-300 dark:bg-gray-700 rounded'></div>
                    <div className='h-6 md:h-7 w-24 md:w-32 bg-gray-300 dark:bg-gray-700 rounded'></div>
                    <div className='h-6 md:h-7 w-20 md:w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
                </div>

                {/* Map skeleton */}
                <div className='w-full h-[250px] md:h-[400px] bg-gray-300 dark:bg-gray-700 rounded-xl mb-4 md:mb-8'></div>

                {/* Contact section skeleton */}
                <div className='h-6 md:h-7 w-32 md:w-40 bg-gray-300 dark:bg-gray-700 rounded mt-4 md:mt-8 mb-2'></div>
                <div className='py-4 px-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-8 flex flex-col md:flex-row justify-between md:items-center gap-3'>
                    <div className='h-5 w-28 md:w-32 bg-gray-300 dark:bg-gray-700 rounded'></div>
                    <div className='h-10 w-full md:w-40 bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                </div>
            </div>
            :   <div className={`${imagesModal ? "hidden" : ""} w-full max-w-[800px]`}>
                <div className="flex flex-col justify-center w-full h-[300px] md:h-[500px] relative">
                    <ChevronLeft className={`${currentIndex===0 ? "invisible" : "text-white shadow-xl hover:bg-gray-500"} w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer absolute left-2`}
                        onClick={() => {goPrev()}}/>
                    <img 
                        src={currentRentad?.images[currentIndex] || null} 
                        alt="image" 
                        className='object-cover w-full h-full rounded-xl'
                    />
                    <ChevronRight className={`${currentIndex===currentRentad?.images.length-1 ? "invisible" : "text-white shadow-xl hover:bg-gray-500"} w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer absolute right-2`}
                        onClick={() => {goNext()}}/>
                </div>
                <div className='w-full flex justify-center items-center gap-1'>
                    {currentRentad?.images && currentRentad?.images.map((pic, index) => (
                        <p key={pic} 
                            className={`text-3xl ${
                                index === currentIndex
                                    ? 'text-lime-500 rounded-xl' 
                                    : 'text-gray-400 rounded-xl'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}>
                            •
                        </p>
                    ))}
                </div>
                <div className='flex justify-between items-center mt-4 md:mt-8 mb-1'>
                    <p className='text-base md:text-lg font-bold tracking-wider dark:text-gray-50'>Details</p>
                    <button className='flex justify-center items-center gap-2 border border-gray-200 
                        dark:border-gray-700 rounded-xl px-3 py-1 cursor-pointer text-sm md:text-base'
                        onClick={() => setIsOpenShare(true)}>
                        <Share className='w-4 h-4 dark:text-gray-50'/>
                        <p className="dark:text-gray-50">Share</p>
                    </button>
                </div>
                <div className="flex flex-col pt-2 px-4 pb-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 md:mb-8">
                    <div className='flex flex-col py-2 md:py-0'>
                        <div className='flex flex-row justify-between md:items-center w-full'>
                            <div className='flex gap-4'>
                                <p className='font-semibold tracking-wider dark:text-gray-50 text-sm md:text-base'>
                                    {currentRentad?.property}
                                </p>
                                <p className='text-sm md:text-base dark:text-gray-50'><span className="text-lime-400">{currentRentad?.rent_currency}</span> {currentRentad?.rent} / {currentRentad?.rent_period}</p>
                            </div>
                            <p className='text-xs md:text-sm text-gray-500 dark:text-gray-400'>{Math.floor((new Date() - new Date(currentRentad?.created_at)) / (1000 * 60 * 60 * 24))===0 ? 'Today' : 
                                Math.floor((new Date() - new Date(currentRentad?.created_at)) / (1000 * 60 * 60 * 24))===1 ? 'Yesterday' : 
                                `${Math.floor((new Date() - new Date(currentRentad?.created_at)) / (1000 * 60 * 60 * 24))} days ago` }
                            </p>
                        </div>
                        <div className='flex flex-row gap-1 md:gap-2 dark:text-gray-50 text-sm md:text-base'>
                            <p>{currentRentad?.area} {currentRentad?.area_unit}</p>
                            <span className=''>•</span>
                            <p>{currentRentad?.bedrooms} bedrooms</p>
                            <span className=''>•</span>
                            <p>{currentRentad?.bathrooms} bathrooms</p>
                        </div>
                        <div className='flex flex-wrap gap-2 pt-2 text-sm md:text-base'>
                            {currentRentad?.offers && currentRentad?.offers.map(offer => (
                                <div key={offer} className='flex justify-center items-center gap-1'>
                                    <CircleCheck className="w-4 h-4 text-lime-600"/>
                                    <p className="dark:text-gray-50">
                                        {offer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    
                </div>
                <div className='flex flex-row flex-wrap gap-1 text-base md:text-lg font-bold tracking-wider mb-1 dark:text-gray-50'>
                    <p>in</p>
                    <p>{currentLocation?.county}</p>,
                    <p>{currentLocation?.city}</p>
                </div>
                <DetailMap lat={currentLocation?.lat} lon={currentLocation?.lon} wth={"100%"}/>
                <p className='mt-4 md:mt-8 text-base md:text-lg font-bold tracking-wider dark:text-gray-50'>Contact</p>
                <div className='py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-8 flex flex-col md:flex-row justify-between md:items-center gap-3'>
                    <p className='dark:text-gray-50 cursor-pointer text-sm md:text-base'
                        onClick={() => navigate(`/random-profile/${currentRentad?.user_id}`)}>
                        {currentRentad?.user_type} {currentRentad?.user_name}
                    </p>
                    <div className='flex flex-row justify-center items-center gap-2
                        cursor-pointer py-2 px-4 rounded-xl shadow-inner dark:hover:bg-gray-800 hover:bg-gray-100 text-sm md:text-base'
                        onClick={() => {handleCopy();}}>
                        {copied 
                        ? <Check className='w-4 h-4 text-lime-500'/>
                        : <Copy className='w-4 h-4 text-gray-400'/>}
                        <p className="dark:text-gray-50">{currentRentad?.user_phone}</p>
                    </div>
                </div>
            </div>
            }

            {isOpenShare && (
                <div className='fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4'>
                    <div className='bg-gray-50 dark:bg-gray-900 p-4 flex flex-col gap-4 rounded-xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <p className='dark:text-gray-50 md:text-xl font-semibold tracking-wider'>Share</p>
                            <X className='w-8 h-8 hover:bg-gray-300 p-2 rounded-xl' 
                                onClick={() => setIsOpenShare(false)}/>
                        </div>
                        <div className='py-2 px-4 md:px-8 shadow-inner border border-gray-200 rounded-xl
                            flex flex-row justify-center items-center gap-2'>
                            {shareCopied
                            ? <Check className="w-4 h-4 text-lime-400"/>
                            : <Copy className="w-4 h-4 text-lime-400"/>
                            }
                            <p className='text-gray-800 overflow-scroll'>{window.location.origin + window.location.pathname}</p>
                        </div>
                        <div className='flex flex-row-reverse'>
                            <button className='bg-lime-400 py-2 px-4 rounded-xl cursor-pointer'
                                onClick={() => handleShare()}>Copy</button>
                        </div>
                    </div>
                </div>
            )}
            

            {imagesModal && 
                <div className='fixed inset-0 z-50 bg-black bg-opacity-90'>
                    <button onClick={() => {setImagesModal(false);}}
                            className='absolute top-4 right-4 md:right-[200px] text-white hover:bg-gray-600 rounded-xl py-2 px-4 cursor-pointer z-50'>
                            <X />
                    </button> 
                    <div className="flex items-center justify-center md:justify-evenly h-full px-4 md:px-0">
                        <ChevronLeft className={`${currentIndex===0 ? "invisible" : "text-white hover:bg-gray-500"} w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer flex-shrink-0`}
                        onClick={() => {goPrev()}}/>
                        <img src={currentRentad.images[currentIndex]} alt="image" className='w-full max-w-[800px] h-auto max-h-[80vh] object-contain transition-transform duration-300 mx-2 md:mx-4'/>
                        <ChevronRight className={`${currentIndex===currentRentad.images.length-1 ? "invisible" : "text-white hover:bg-gray-500"} w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer flex-shrink-0`}
                        onClick={() => {goNext()}}/>
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailPage