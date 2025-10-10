import { useRentadStore } from '../stores/useRentadStore'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, X, CircleCheck, Copy, Check, Share } from 'lucide-react'
import { useLocationStore } from '../stores/useLocationStore'
import DetailMap from '../components/DetailMap'
import { useUserStore } from '../stores/useUserStore'



const DetailPage = () => {
    const { fetchRentad, currentRentad } = useRentadStore()
    const { id } = useParams()
    const { getLocation, currentLocation, setCurrentLocation } = useLocationStore()
    const navigate = useNavigate()

    const [imagesModal, setImagesModal] = useState(false) 
    const [currentIndex, setCurrentIndex] = useState(0)
    const [copied, setCopied] = useState(false)
    const [shareCopied, setShareCopied] = useState(false)



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
        <div className="flex justify-center items-center">
            <div className={`${imagesModal ? "hidden" : ""}`}>
                <div className="flex flex-col justify-center w-[800px] h-[500px] relative">
                    <img 
                        src={currentRentad?.images?.[0]|| null} 
                        alt="image" 
                        className='object-cover w-[100%] h-[100%] rounded-[10px]'
                    />
                    <button className='absolute bottom-2 right-2 bg-gray-100 py-1 px-4 
                        cursor-pointer rounded-[5px] z-20'
                        onClick={() => setImagesModal(true)}>
                        Show all pics
                    </button>
                </div>
                <div className='flex justify-between items-center mt-8 mb-1'>
                    <p className='text-lg font-bold tracking-wider'>Details</p>
                    <button className='flex justify-center items-center gap-2 ml-2 border border-gray-200 
                        rounded-[10px] px-3 py-1 cursor-pointer'
                        onClick={handleShare}>
                        {shareCopied 
                        ? <Check className='w-4 h-4'/>
                        : <Share className='w-4 h-4'/>}
                        <p>Share</p>
                    </button>
                </div>
                <div className="flex flex-col pl-4 pr-2 pb-4 border border-gray-200 rounded-[10px] mb-8">
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col'>
                            <div className='flex justify-start items-center gap-2'>
                                <p className='font-semibold tracking-wider'>
                                    {currentRentad?.property}
                                </p>
                                <p className='text-gray-500'>{Math.floor((new Date() - new Date(currentRentad?.created_at)) / (1000 * 60 * 60 * 24))===0 ? 'Today' : 
                                    Math.floor((new Date() - new Date(currentRentad?.created_at)) / (1000 * 60 * 60 * 24))===1 ? 'Yesterday' : 
                                    `${Math.floor((new Date() - new Date(currentRentad?.created_at)) / (1000 * 60 * 60 * 24))} days ago` }
                                </p>
                            </div>
                            <div className='flex flex-row justify-start items-center gap-2'>
                                <p>{currentRentad?.area} {currentRentad?.area_unit}</p>
                                <span>•</span>
                                <p>{currentRentad?.bedrooms} bedrooms</p>
                                <span>•</span>
                                <p>{currentRentad?.bathrooms} bathrooms</p>
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-center border border-lime-500 rounded-[10px] py-2 px-4 mt-2'>
                            <p className=''>{currentRentad?.rent_currency} {currentRentad?.rent}</p>
                            <p>{currentRentad?.rent_period}</p>
                        </div>
                    </div>
                    
                    <div className='flex justify-start items-center gap-2 pt-2'>
                        {currentRentad?.offers && currentRentad?.offers.map(offer => (
                            <div key={offer} className='flex justify-center items-center gap-1'>
                                <CircleCheck className="w-4 h-4 text-lime-600"/>
                                <p  
                                    className="">
                                    {offer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-row gap-1 text-lg font-bold tracking-wider mb-1'>
                    <p>in</p>
                    <p>{currentLocation?.county}</p>,
                    <p>{currentLocation?.city}</p>
                </div>
                <DetailMap lat={currentLocation?.lat} lon={currentLocation?.lon} wth={"800px"}/>
                <p className='mt-8 text-lg font-bold tracking-wider'>Contact {currentRentad?.user_type}</p>
                <div className='py-2 px-4 border border-gray-200 rounded-[10px] mb-8 flex justify-between items-center'>
                    <p>{currentRentad?.user_name}</p>
                    <div className='flex flex-row justify-center items-center gap-2
                        cursor-pointer py-1 px-4 rounded-[10px] shadow-inner bg-gray-100'
                        onClick={handleCopy}>
                        {copied 
                        ? <Check className='w-4 h-4 text-lime-500'/>
                        : <Copy className='w-4 h-4 text-gray-400'/>}
                        <p>{currentRentad?.user_phone}</p>
                    </div>
                </div>
            </div>

            {imagesModal && 
                <div className='fixed inset-0 z-50 bg-black bg-opacity-90'>
                    <button onClick={() => {setImagesModal(false);}}
                            className='absolute top-4 right-[200px] text-white hover:bg-gray-600 rounded-[10px] py-1 px-4 cursor-pointer'>
                            <X />
                    </button> 
                    <div className="flex items-center justify-evenly mt-[100px]">
                        <ChevronLeft className={`${currentIndex===0 ? "text-black" : "text-white hover:bg-gray-500"}  w-12 h-12 rounded-full p-2`}
                        onClick={() => {goPrev()}}/>
                        <img src={currentRentad.images[currentIndex]} alt="image" className='w-[800px] h-[600px] object-cover transition-transform duration-300'/>
                        <ChevronRight className={`${currentIndex===currentRentad.images.length-1 ? "text-black" : "text-white hover:bg-gray-500"} w-12 h-12 rounded-full p-2`}
                        onClick={() => {goNext()}}/>
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailPage
