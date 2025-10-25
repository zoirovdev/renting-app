import { useRentadStore } from '../stores/useRentadStore'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, X, CircleCheck, Copy, Check, Share, PencilLine, Trash2, 
    HandCoins, Bed, Bath, Minus, Plus, Coins, EllipsisVertical, Upload, ImagePlus, Trash
} from 'lucide-react'
import { useLocationStore } from '../stores/useLocationStore'
import DetailMap from '../components/DetailMap'
import { useUserStore } from '../stores/useUserStore'
import axios from 'axios'
import toast from "react-hot-toast"

const DetailEditPage = () => {
    const { fetchRentad, currentRentad, loading, deleteById, formData, setFormData, resetFormData,
        updateById
    } = useRentadStore()
    const { id } = useParams()
    const { getLocation, currentLocation, setCurrentLocation } = useLocationStore()
    const navigate = useNavigate()

    const [selectedOffers, setSelectedOffers] = useState([])
    const offerOptions = [
        'lease agreement', 'recently renovated', 'rent includes all fees', 
        'wifi', 'tv', 'air conditioning', 'vacuum cleaner', 'fridge', 'washing machine'
    ]
    const periodOptions = ['month', 'week', 'day', 'year']

    const [imagesModal, setImagesModal] = useState(false) 
    const [currentIndex, setCurrentIndex] = useState(0)
    const [copied, setCopied] = useState(false)
    const [shareCopied, setShareCopied] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const [isOpenBtns, setIsOpenBtns] = useState(false)
    const [buildingImages, setBuildingImages] = useState([]) 
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [error, setError] = useState(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [isOpenShare, setIsOpenShare] = useState(false)

    useEffect(() => {
        if(currentRentad){
            setFormData({ ...currentRentad })
            setSelectedOffers(currentRentad?.offers || [])
            setBuildingImages(currentRentad?.images || [])
            console.log(currentRentad)
        }
    }, [currentRentad])

    const handleDelete = async () => {
        await deleteById(currentRentad?.id)
        toast.success("Listing deleted!")
        navigate(-1)
    }

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

    const handleOffer = (offer) => {
        setSelectedOffers(prev =>
            prev.includes(offer) ? prev.filter(item => item !== offer) : [...prev, offer]
        )
    }

    useEffect(() => {
        setFormData({ ...formData, rent_currency: '$' })
    }, [])


    useEffect(() => {
        setCurrentIndex(0)
        fetchRentad(id)
    }, [id])

    useEffect(() => {
        if (currentRentad?.location_id) {
            getLocation(currentRentad.location_id)
        }
    }, [currentRentad?.location_id])

    useEffect(() => {
        setFormData({ ...formData, offers: selectedOffers })
    }, [selectedOffers])

    const updateBedrooms = (val) => {
        const newValue = formData.bedrooms + val
        if(newValue >= 0 && newValue <= 20){
            setFormData({ ...formData, bedrooms: newValue })
        }
    }

    const updateBathrooms = val => {
        const newValue = formData.bathrooms + val
        if(newValue >= 0 && newValue <= 20){
            setFormData({ ...formData, bathrooms: newValue })
        }
    }

    const handleUpdate = async () => {
        try {
            setUpdateLoading(true)
            setError(null)
            
            // Update formData with the new images
            const updatedFormData = {
                ...formData,
                images: buildingImages,
                offers: selectedOffers
            }
            
            setFormData(updatedFormData)
            
            // Call the update function from the store
            await updateById(id, updatedFormData)
            
            // Close the edit modal
            setIsOpenEdit(false)
            
            // Refresh the current rental ad
            await fetchRentad(id)
            toast.success("Successfully updated!")
            resetFormData()
        } catch (err) {
            console.error('Update failed:', err)
            setError(err.message || 'Failed to update listing')
        } finally {
            setUpdateLoading(false)
        }
    }

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files)
        const imageFiles = files.filter(file => file.type.startsWith('image/'))

        if (imageFiles.length === 0) {
            alert('Please select valid image files')
            return
        }

        setUploading(true)
        setError(null)

        for (const imageFile of imageFiles) {
            if (imageFile.size > 10 * 1024 * 1024) {
                alert(`File ${imageFile.name} is too large (max 10MB)`)
                continue
            }

            try {
                setUploadProgress(prev => ({
                    ...prev,
                    [imageFile.name]: 'uploading'
                }))

                const imageForm = new FormData()
                imageForm.append('image', imageFile)

                const response = await axios.post(
                    `${import.meta.env.MODE === "development" ? "http://localhost:8000" : ""}/api/rentads/upload`, 
                    imageForm
                )
                
                const data = response.data
                
                setBuildingImages(prev => [...prev, data.imageUrl])

                setUploadProgress(prev => ({
                    ...prev,
                    [imageFile.name]: 'completed'
                }))

            } catch (error) {
                console.error('Upload failed:', error)
                alert(`Failed to upload ${imageFile.name}: ${error.message}`)
                
                setUploadProgress(prev => ({
                    ...prev,
                    [imageFile.name]: 'failed'
                }))
            }
        }

        setUploading(false)
        e.target.value = ''
        
        setTimeout(() => {
            setUploadProgress({})
        }, 3000)
    }

    const removeImage = (index) => {
        setBuildingImages(prev => prev.filter((_, i) => i !== index))
    }
   
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
                    <ChevronLeft className={`${currentIndex===0 ? "invisible" : "text-white"} w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer absolute left-2`}
                        onClick={() => {goPrev()}}/>
                    <img 
                        src={currentRentad?.images?.[currentIndex] || ''} 
                        alt="image" 
                        className='object-cover w-full h-full rounded-xl'
                    />
                    <ChevronRight className={`${currentIndex===currentRentad?.images?.length-1 ? "invisible" : "text-white"} w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer absolute right-2`}
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
                            onClick={() => setCurrentIndex(index)}>
                            •
                        </p>
                    ))}
                </div>
                
                <div className='flex justify-between items-center mt-4 md:mt-8 mb-1'>
                    <p className='text-base md:text-lg font-bold tracking-wider dark:text-gray-50'>Details</p>
                    <div className='flex gap-1'>
                        <button className='flex justify-center items-center gap-2 border border-gray-200 
                            dark:border-gray-700 rounded-xl px-3 py-1 cursor-pointer text-sm md:text-base'
                            onClick={() => setIsOpenDelete(true)}>
                            <Trash2 className='w-4 h-4 dark:text-gray-50'/>
                            <p className="dark:text-gray-50">Delete</p>
                        </button>
                        <button className='flex justify-center items-center gap-2 border border-gray-200 
                            dark:border-gray-700 rounded-xl px-3 py-1 cursor-pointer text-sm md:text-base'
                            onClick={() => setIsOpenEdit(true)}>
                            <PencilLine className='w-4 h-4 dark:text-gray-50'/>
                            <p className="dark:text-gray-50">Edit</p>
                        </button>
                        <button className='flex justify-center items-center gap-2 border border-gray-200 
                            dark:border-gray-700 rounded-xl px-3 py-1 cursor-pointer text-sm md:text-base'
                            onClick={() => setIsOpenShare(true)}>
                            <Share className='w-4 h-4 dark:text-gray-50'/>
                            <p className="dark:text-gray-50">Share</p>
                        </button>
                    </div>
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
                            <p>{currentRentad?.bedrooms} bedrooms</p>
                            <span className=''>•</span>
                            <p>{currentRentad?.area} {currentRentad?.area_unit}</p>
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
                    <div className='dark:text-gray-50 cursor-pointer text-sm md:text-base'
                        onClick={() => navigate(`/random-profile/${currentRentad?.user_id}`)}>
                        <p className='text-lg'>{currentRentad?.user_name}</p>
                        <p className='text-gray-700 dark:text-gray-200'>{currentRentad?.user_type}</p> 
                    </div>
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

            {isOpenEdit && (
                <div className='fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4 tracking-wider'>
                    <div className='flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto '>
                        <div className='flex justify-between items-center py-4 px-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 '>
                            <p className="md:text-xl font-semibold tracking-wider dark:text-gray-50">Edit Listing</p>
                            <X className='w-8 h-8 p-2 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-xl cursor-pointer dark:text-gray-50' 
                                onClick={() => setIsOpenEdit(false)}/>
                        </div>
                        
                        <div className='flex flex-col gap-4 py-4 px-4'>
                            {error && (
                                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl'>
                                    {error}
                                </div>
                            )}

                            {/* Image Upload Section */}
                            <div className='flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl p-4 gap-3'>
                                <div className='flex justify-start items-center gap-2'>
                                    <ImagePlus className="w-4 h-4 dark:text-gray-100"/>
                                    <label className='text-sm md:text-base text-gray-500 dark:text-gray-200'>Images</label>
                                </div>
                                
                                <div className='grid grid-cols-3 gap-2'>
                                    {buildingImages.map((image, index) => (
                                        <div key={index} className='relative group'>
                                            <img 
                                                src={image} 
                                                alt={`Building ${index + 1}`}
                                                className='w-full h-24 object-cover rounded-lg'
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full
                                                    opacity-100 transition-opacity'
                                            >
                                                <Trash2 className='w-4 h-4'/>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <label className='flex flex-col items-center justify-center border-2 border-dashed 
                                    border-gray-300 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500'>
                                    <Upload className='w-8 h-8 text-gray-400 dark:text-gray-200'/>
                                    <span className='text-sm text-gray-500 mt-2 dark:text-gray-200'>
                                        {uploading ? 'Uploading...' : 'Click to upload images'}
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className='hidden'
                                        disabled={uploading}
                                    />
                                </label>

                                {Object.keys(uploadProgress).length > 0 && (
                                    <div className='flex flex-col gap-1'>
                                        {Object.entries(uploadProgress).map(([filename, status]) => (
                                            <div key={filename} className='flex items-center gap-2 text-xs'>
                                                <span className='truncate flex-1'>{filename}</span>
                                                <span className={`
                                                    ${status === 'completed' ? 'text-green-600' : ''}
                                                    ${status === 'failed' ? 'text-red-600' : ''}
                                                    ${status === 'uploading' ? 'text-blue-600' : ''}
                                                `}>
                                                    {status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Rent Section */}
                            <div className='flex flex-col pt-4 pb-6 px-4 md:px-6 gap-2 border border-gray-200 dark:border-gray-700
                                rounded-xl'>
                                <div className='flex justify-start items-center gap-2'>
                                    <Coins className="w-4 h-4 dark:text-gray-50"/>
                                    <label htmlFor='rent' className='text-sm md:text-base text-gray-500 dark:text-gray-100'>Rent</label>
                                </div>
                                <div className='flex flex-col md:flex-row justify-between gap-2'>
                                    <p className='border border-gray-200 dark:border-gray-700 dark:text-gray-50 rounded-xl py-2 px-4 text-sm md:text-base'>
                                        {formData?.rent_currency}
                                    </p>
                                    <input 
                                        type="number"
                                        id="rent" 
                                        name="rent"
                                        className="w-full md:basis-[80%] border border-gray-200 dark:border-gray-700
                                            dark:text-gray-50 rounded-xl px-4 py-2
                                            text-sm md:text-base outline-none appearance-none 
                                            [&::-webkit-outer-spin-button]:appearance-none 
                                            [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder='amount of rent payment'
                                        value={formData?.rent || ''} 
                                        onChange={(e) => { setFormData({ ...formData, rent: e.target.value })}}
                                    />
                                    <select value={formData?.rent_period}
                                        className='border border-gray-200 dark:border-gray-700 dark:text-gray-50 rounded-xl py-2 px-4 text-sm md:text-base'
                                        onChange={(e) => setFormData({ ...formData, rent_period: e.target.value })}>
                                        {periodOptions.map(period => (
                                            <option key={period} value={period}>{period}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Bedrooms and Bathrooms */}
                            <div className='flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl'>
                                <div className='flex justify-between items-center pt-4 pb-4 px-4 md:px-6 dark:border-gray-700'>
                                    <div className='flex justify-start items-center gap-2'>
                                        <Bed className='w-4 h-4 dark:text-gray-100'/>
                                        <label className='text-sm md:text-base text-gray-500 dark:text-gray-100'>Rooms</label>
                                    </div>
                                    <div className='flex flex-row justify-center items-center'>
                                        <Minus 
                                            className='border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 
                                                cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-gray-100' 
                                            onClick={() => updateBedrooms(-1)}
                                        />
                                        <input 
                                            className="w-[30px] md:w-[40px] ml-2 text-center text-sm md:text-base dark:text-gray-100"
                                            onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                                            value={formData?.bedrooms || 0}
                                            type="number"
                                        />
                                        <Plus 
                                            className='border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 
                                                cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-gray-100' 
                                            onClick={() => updateBedrooms(+1)}
                                        />
                                    </div>
                                </div>

                                {/* <div className='flex justify-between items-center pt-4 pb-6 px-4 md:px-6'>
                                    <div className='flex justify-start items-center gap-2'>
                                        <Bath className='w-4 h-4 dark:text-gray-100'/>
                                        <label htmlFor='bathrooms' className='text-sm md:text-base text-gray-500 dark:text-gray-100'>Bathrooms</label>
                                    </div>
                                    <div className='flex flex-row justify-center items-center'>
                                        <Minus 
                                            className='border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 
                                                cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-gray-100' 
                                            onClick={() => updateBathrooms(-1)}
                                        />
                                        <input 
                                            className="w-[30px] md:w-[40px] ml-2 text-center text-sm md:text-base dark:text-gray-100"
                                            onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                                            value={formData?.bathrooms || 0}
                                            type="number"
                                        />
                                        <Plus 
                                            className='border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 
                                                cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-gray-100' 
                                            onClick={() => updateBathrooms(+1)}
                                        />
                                    </div>
                                </div> */}
                            </div>

                            {/* Offers */}
                            <div className='flex flex-col justify-center items-center pt-4 pb-6 px-4 md:px-6 gap-2
                                border border-gray-200 dark:border-gray-700 rounded-xl'>
                                <div className='flex flex-row justify-start items-center gap-2 w-full'>
                                    <HandCoins className='w-4 h-4 dark:text-gray-100'/>    
                                    <label className="text-sm md:text-base text-gray-500 dark:text-gray-100">Offers</label>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-2'>
                                    {offerOptions.map(offer => (
                                        <div className='flex items-center space-x-2' key={offer}>
                                            <input
                                                type="checkbox"
                                                checked={selectedOffers.includes(offer)}
                                                id={offer}
                                                onChange={() => handleOffer(offer)}
                                                className='cursor-pointer'
                                            />
                                            <label htmlFor={offer} className='text-sm md:text-base cursor-pointer dark:text-gray-100'>
                                                {offer}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2 pt-2'>
                                <button 
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-xl
                                        transition-colors"
                                    onClick={() => setIsOpenEdit(false)}
                                    disabled={updateLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="flex-1 bg-lime-400 hover:bg-lime-500 py-2 px-4 rounded-xl
                                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                        flex items-center justify-center gap-2"
                                    onClick={handleUpdate}
                                    disabled={updateLoading || uploading}
                                >
                                    {updateLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpenShare && (
                <div className='fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4'>
                    <div className='bg-gray-50 dark:bg-gray-900 p-4 flex flex-col gap-4 rounded-xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <p className='dark:text-gray-50 md:text-xl font-semibold tracking-wider'>Share</p>
                            <X className='w-8 h-8 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-xl dark:text-gray-50' 
                                onClick={() => setIsOpenShare(false)}/>
                        </div>
                        <div className='py-2 px-4 md:px-8 shadow-inner border border-gray-200 dark:border-gray-700
                            flex flex-row justify-center items-center gap-2  rounded-xl'>
                            {shareCopied
                            ? <Check className="w-4 h-4 text-lime-400"/>
                            : <Copy className="w-4 h-4 text-lime-400"/>
                            }
                            <p className='text-gray-800 dark:text-gray-400 overflow-scroll'>{window.location.origin + window.location.pathname}</p>
                        </div>
                        <div className='flex flex-row-reverse'>
                            <button className='bg-lime-400 py-2 px-4 rounded-xl cursor-pointer'
                                onClick={() => handleShare()}>Copy</button>
                        </div>
                    </div>
                </div>
            )}
            
            {isOpenDelete && (
                <div className='fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4'>
                    <div className='flex flex-col justify-between fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        z-50 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xl p-6 gap-4 max-w-md w-full mx-4'>
                        <div className='flex flex-col justify-center items-center gap-2'>
                            <p className='text-lg font-semibold dark:text-gray-50'>Are you sure?</p>
                            <p className='text-center text-gray-600 dark:text-gray-400'>This action cannot be undone.</p>
                        </div>
                        <div className='flex gap-2 w-full'>
                            <button onClick={() => setIsOpenDelete(false)}
                                className='flex-1 bg-gray-500 hover:bg-gray-600 text-gray-50 py-2 px-4 
                                    rounded-xl transition-colors cursor-pointer'>
                                Cancel
                            </button>
                            <button 
                                className='flex-1 bg-red-500 hover:bg-red-600 text-gray-50 py-2 px-4 
                                    rounded-xl transition-colors cursor-pointer'
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {imagesModal && 
                <div className='fixed inset-0 z-50 bg-black bg-opacity-90'>
                    <button onClick={() => {setImagesModal(false);}}
                            className='absolute top-4 right-4 md:right-[200px] text-white hover:bg-gray-600 
                                rounded-xl py-2 px-4 cursor-pointer z-50'>
                            <X />
                    </button> 
                    <div className="flex items-center justify-center md:justify-evenly h-full px-4 md:px-0">
                        <ChevronLeft 
                            className={`${currentIndex===0 ? "invisible" : "text-white hover:bg-gray-500"} 
                                w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer absolute left-4 md:left-16`}
                            onClick={() => {goPrev()}}
                        />
                        <img 
                            src={currentRentad.images[currentIndex]} 
                            alt="image" 
                            className='w-full max-w-[800px] h-auto max-h-[80vh] object-contain 
                                transition-transform duration-300 mx-2 md:mx-4'
                        />
                        <ChevronRight 
                            className={`${currentIndex===currentRentad.images.length-1 ? "invisible" : "text-white hover:bg-gray-500"} 
                                w-8 h-8 md:w-12 md:h-12 rounded-xl p-2 cursor-pointer absolute right-4 md:right-16`}
                            onClick={() => {goNext()}}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailEditPage