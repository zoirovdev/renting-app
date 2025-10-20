import { Plus, Minus, Upload, X, House, DollarSign, Coins, Scan, Bed, Bath, HandCoins, User, MapPin } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useRentadStore } from '../stores/useRentadStore'
import { useLocation, useNavigate } from "react-router-dom"
import axios from 'axios'
import { useUserStore } from '../stores/useUserStore'
import { useLocationStore } from '../stores/useLocationStore'
import DetailMap from '../components/DetailMap'

const AddPage = () => {
    const navigate = useNavigate()
    const [inputLocation, setInputLocation] = useState('')
    const [buildingImages, setBuildingImages] = useState([]) 
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [filePaths, setFilePaths] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { formData, createRentad, setFormData, resetFormData } = useRentadStore()
    const { currentUser } = useUserStore()
    const { createLocation, formLocation, setFormLocation, currentLocation, setCurrentLocation } = useLocationStore()

    if(Array.isArray(currentLocation)){
        setCurrentLocation(currentLocation[0])
    }

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const propertyOptions = ['Apartment','House'];
    const currencyOptions = ['$']
    const periodOptions = ['period','month', 'week', 'day', 'year']
    const unitOptions = ['unit','m²']
    const userTypeOptions = ['Rieltor', 'Landlord']

    const [selectedOffers, setSelectedOffers] = useState([])
    const offerOptions = [
        'lease agreement', 'recently renovated', 'rent includes all fees', 
        'wifi', 'tv', 'air conditioning', 'vacuum cleaner', 'fridge', 'washing machine'
    ]


    const handleOffer = (offer) => {
        setSelectedOffers(prev =>
            prev.includes(offer) ? prev.filter(item => item !== offer) : [...prev, offer]
        )
    }


    useEffect(() => {
        setFormData({ ...formData, rent_currency: '$'})
    }, [])

    useEffect(() => {
        setFormData({ ...formData, area_unit: 'sqm'})
    }, [])
    
    useEffect(() => {
        setFormData({ ...formData, offers: selectedOffers })
    }, [selectedOffers]);


    useEffect(() => {
        setFormData({ ...formData, images: buildingImages });
    }, [buildingImages]);


        
    const updateBedrooms = (val) => {
        if(formData.bedrooms >= 0 && formData.bedrooms <=20){
            setFormData({ ...formData, bedrooms: formData.bedrooms+val})
        }
    }

    const updateBathrooms = val => {
        if(formData.bathrooms >= 0 && formData.bathrooms <=20){
            setFormData({ ...formData, bathrooms: formData.bathrooms+val})
        }
    }


    const success = async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
            // Get address using reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'RentedApp/1.0'
                    }
                }
            );
            const data = await response.json();
            
            if (data && data.address) {
                // Create location object with all data at once
                const locationData = {
                    lat: latitude,
                    lon: longitude,
                    accuracy: position.coords.accuracy,
                    city: data?.address?.city || '',
                    country: data?.address?.country || '',
                    county: data?.address?.county || '',
                    neighbourhood: data?.address?.neighbourhood || '',
                    postcode: data?.address?.postcode || '',
                    road: data?.address?.road || '',
                    suburb: data?.address?.suburb || '',
                    display_name: data?.display_name || ''
                };
                
                // Set form location all at once
                setFormLocation(locationData);

                // Set input display
                setInputLocation(`${locationData.neighbourhood ? locationData.neighbourhood + ', ' : locationData.road ? locationData.road + ', ' : ''}${locationData.county}, ${locationData.city}`);
                
                await createLocation();
                setTimeout(() => {
                    const { currentLocation } = useLocationStore.getState();
                    if (currentLocation) {
                        console.log(currentLocation)
                        setFormData({ 
                            ...formData, 
                            location_id: currentLocation?.id,
                            location_display: currentLocation?.county + ', ' + currentLocation?.city,
                            user_id: currentUser?.id,
                            user_name: currentUser?.firstname + ' ' + currentUser?.lastname,
                            user_phone: currentUser?.phone,
                        });
                    }
                }, 100);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Reverse geocoding or location creation failed:', error);
            setError('Failed to get location details');
            setLoading(false);
        }
    };

    
    // Error callback
    const handleError = (error) => {
        let errorMessage = 'An unknown error occurred.';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'User denied the request for Geolocation.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable.';
                break;
            case error.TIMEOUT:
                errorMessage = 'The request to get user location timed out.';
                break;
            default:
                errorMessage = 'An unknown error occurred.';
                break;
        }
        
        setError(errorMessage);
        setLoading(false);
    }

    const getLocation = () => {
        setLoading(true);
        setError(null);
        
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(success, handleError, options);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createRentad(e)
        } catch (err){
            console.log("error at handleSubmit", err)
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

                const response = await axios.post(`${import.meta.env.MODE === "development" ? "http://localhost:8000" : ""}/api/rentads/upload`, imageForm)
                
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

    console.log(formData)
    console.log(currentLocation)

    return (
        <div className='flex justify-center items-center px-4 md:px-0 pb-20 md:pb-8'>
            <div className='w-full max-w-[800px] mt-4 md:mt-[50px] p-4 md:p-8 space-y-4'>
                <div className='flex flex-col justify-center items-center'>
                    <p className='text-lg md:text-xl font-bold tracking-wider dark:text-gray-50'>List your property</p>
                    <p className='text-sm md:text-lg text-gray-500 dark:text-gray-400 text-center'>Fill details to create your rental listing</p>
                </div>

                {/* Property */}
                <div className='flex flex-col justify-center items-center pt-4 pb-6 px-4 md:px-6 gap-2 
                    border dark:border-gray-700 border-gray-200 rounded-xl'>
                    <div className="flex justify-start items-center gap-2 w-full">
                        <House className="w-4 h-4 dark:text-gray-100"/>
                        <label htmlFor='property' className="text-sm md:text-base text-gray-500 dark:text-gray-100">
                            Property type
                        </label>
                    </div>
                    
                    <div className='flex flex-col md:flex-row justify-center w-full gap-2'>
                        {propertyOptions && propertyOptions.map(pType => (
                            <button key={pType} className={`border dark:border-none border-gray-200 rounded-xl py-3 md:py-4 px-4 md:px-8
                                w-full md:w-[50%] hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 cursor-pointer 
                                flex justify-center items-center gap-2
                                focus:ring-2 focus:ring-lime-500 text-sm md:text-base`}
                                onClick={() => { setFormData({ ...formData, property: pType })}}>
                                <img src={`${pType==="Apartment" ? "apartment-building.svg" : "house-building.svg"}`} alt="home" 
                                    className='w-8 h-8 md:w-10 md:h-10 object-cover dark:invert'/>
                                <p className='dark:text-gray-100'>{pType}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rent and Area */}
                <div className='flex flex-col border dark:border-gray-700 border-gray-200 rounded-xl'>
                    <div className='flex flex-col pt-4 pb-6 px-4 md:px-6 gap-2 border-b border-gray-200 dark:border-gray-700'>
                        <div className='flex justify-start items-center gap-2'>
                            <Coins className="w-4 h-4 dark:text-gray-100"/>
                            <label htmlFor='rent' className='text-sm md:text-base text-gray-500 dark:text-gray-100'>Rent</label>
                        </div>
                        <div className='flex flex-col md:flex-row justify-between gap-2'>
                            <p 
                               className={`border border-gray-200 dark:border-gray-700 dark:text-gray-400 
                               rounded-xl py-2 px-4 text-sm md:text-base`}>
                                {formData?.rent_currency}
                            </p>
                            <input 
                                type="number"
                                id="rent" name="rent"
                                className="w-full md:basis-[80%] border dark:border-gray-700 border-gray-200
                                    rounded-xl px-4 py-2 dark:text-gray-100 text-sm md:text-base
                                    outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 
                                    [&::-webkit-inner-spin-button]:m-0"
                                placeholder='amount of rent payment'
                                value={formData?.rent || ''} 
                                onChange={(e) => { setFormData({ ...formData, rent: e.target.value })}}
                            />
                            <select value={formData?.rent_period}
                                className='border border-gray-200 dark:border-gray-700 dark:text-gray-400 rounded-xl py-2 px-4 text-sm md:text-base'
                                onChange={(e) => setFormData({ ...formData, rent_period: e.target.value })}>
                                {periodOptions.map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-col pt-4 pb-6 px-4 md:px-6 gap-2'>
                        <div className="flex flex-row justify-start items-center gap-2">
                            <Scan className="w-4 h-4 dark:text-gray-100"/>
                            <label htmlFor='area' className='text-sm md:text-base text-gray-500 dark:text-gray-100'>Total Area</label>
                        </div>
                        <div className='flex flex-col md:flex-row justify-between gap-2'>
                            <input 
                                type="number"
                                id="area" name="area"
                                className="outline-none w-full md:basis-[90%] border border-gray-200 dark:border-gray-700
                                    rounded-xl py-2 px-4 dark:text-gray-100 text-sm md:text-base
                                    appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 
                                    [&::-webkit-inner-spin-button]:m-0"
                                placeholder='amount of total area'
                                value={formData?.area || ''}
                                onChange={(e) => { setFormData({ ...formData, area: e.target.value })}}
                            />
                            <p
                                className='border border-gray-200 dark:border-gray-700 dark:text-gray-400 rounded-xl py-2 px-4 text-sm md:text-base'>
                                {formData?.area_unit}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rooms */}
                <div className='flex flex-col border dark:border-gray-700 border-gray-200 rounded-xl'>

                    <div className='flex justify-between items-center pt-4 pb-6 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700'>
                        <div className='flex justify-start items-center gap-2'>
                            <Bed className='w-4 h-4 dark:text-gray-100'/>
                            <label className='text-sm md:text-base text-gray-500 dark:text-gray-100'>Bedrooms</label>
                        </div>
                        <div className='flex flex-row justify-center items-center'>
                            <Minus 
                                className='border border-gray-200 dark:border-gray-700 dark:text-gray-100
                                rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
                                onClick={() => updateBedrooms(-1)}
                            />
                            <input className="w-[30px] md:w-[40px] ml-2 text-center dark:text-gray-100 text-sm md:text-base"
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                value={formData.bedrooms}
                            />
                            <Plus 
                                className='border border-gray-200 dark:border-gray-700 dark:text-gray-100
                                rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
                                onClick={() => updateBedrooms(+1)}
                            />
                        </div>
                    </div>

                    <div className='flex justify-between items-center pt-4 pb-6 px-4 md:px-6'>
                        <div className='flex justify-start items-center gap-2'>
                            <Bath className='w-4 h-4 dark:text-gray-100'/>
                            <label htmlFor='bathrooms' className='text-sm md:text-base text-gray-500 dark:text-gray-100'>Bathrooms</label>
                        </div>
                        <div className='flex flex-row justify-center items-center'>
                            <Minus 
                                className='border border-gray-200 dark:border-gray-700 dark:text-gray-100
                                rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
                                onClick={() => updateBathrooms(-1)}
                            />
                            <input className="w-[30px] md:w-[40px] ml-2 text-center dark:text-gray-100 text-sm md:text-base"
                                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                value={formData.bathrooms}
                            />
                            <Plus 
                                className='border border-gray-200 dark:border-gray-700 dark:text-gray-100
                                rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
                                onClick={() => updateBathrooms(+1)}
                            />
                        </div>
                    </div>
                </div>

                {/* Offers */}
                <div className='flex flex-col justify-center items-center pt-4 pb-6 px-4 md:px-6 gap-2
                    border dark:border-gray-700 border-gray-200 rounded-xl'>
                    <div className='flex flex-row justify-start items-center gap-2 w-full'>
                        <HandCoins className='w-4 h-4 dark:text-gray-100'/>    
                        <label htmlFor="" className="text-sm md:text-base text-gray-500 dark:text-gray-100">Offers</label>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-2'>
                        {offerOptions.map(offer => (
                            <div className='flex items-center space-x-2' key={offer}>
                                <input
                                    type="checkbox"
                                    checked={selectedOffers.includes(offer)}
                                    id={offer}
                                    onChange={(e) => handleOffer(offer)}
                                    className='cursor-pointer'/>
                                <label htmlFor={offer} className='dark:text-gray-100 text-sm md:text-base cursor-pointer'>{offer}</label>
                            </div>
                        )) }
                    </div>
                </div>
                
                {/* Location */}
                <div className='flex flex-col justify-center items-center gap-2 
                    border dark:border-gray-700 border-gray-200 rounded-xl overflow-hidden'>
                    <DetailMap lat={currentLocation?.lat} lon={currentLocation?.lon}/>  
                    <div className='flex flex-col md:flex-row justify-between items-stretch md:items-center w-full gap-2 pt-4 pb-6 px-4 md:px-6'>
                        <div className='flex flex-row justify-start items-center gap-2 flex-1'>
                            <MapPin className="w-4 h-4 flex-shrink-0 dark:text-gray-50"/>
                            <input 
                                type='text'
                                className='outline-none flex-1 overflow-scroll 
                                border-b border-gray-200 dark:border-gray-700
                                py-2 px-2 md:px-4 dark:text-gray-100 text-sm md:text-base'
                                value={inputLocation || ''}
                                readOnly
                                placeholder='Location will appear here...'
                            />
                        </div>
                        <button 
                            className='w-full md:w-auto py-2 px-4 cursor-pointer dark:text-gray-50 text-sm md:text-base whitespace-nowrap
                            border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl'
                            onClick={getLocation}>
                            {loading ? 'Getting...' : 'Get location'}
                        </button>
                    </div>
                </div>

                {/* User */}
                <div className='flex flex-col pt-4 pb-6 px-4 md:px-6 gap-2 
                    border dark:border-gray-700 border-gray-200 rounded-xl'>
                    <div className='flex justify-start items-center gap-2'>
                        <User className='w-4 h-4 dark:text-gray-100'/>
                        <label htmlFor='property' className="text-sm md:text-base text-gray-500 dark:text-gray-100">
                        I am
                        </label>
                    </div>
                    
                    <div className='flex flex-col md:flex-row gap-2'>
                        {userTypeOptions.map(userType => (
                            <button key={userType} 
                                className={`border border-gray-200 dark:border-gray-700 rounded-xl py-2 md:py-2 px-4 md:px-8
                                w-full md:w-[50%] hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-gray-100
                                focus:ring-2 focus:ring-lime-500 text-sm md:text-base`}
                                onClick={() => { setFormData({ ...formData, user_type: userType })}}
                            >
                                {userType}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div className='flex justify-between items-center py-3 md:py-2 px-4 my-4 md:my-8 
                    border dark:border-gray-700 border-gray-200 rounded-xl dark:text-gray-100'>
                    <input type='file' multiple
                        accept='image/*'
                        className="hidden"
                        onChange={handleImageChange}
                        id="file-upload"
                        disabled={uploading}/>
                    <label htmlFor='file-upload' 
                        className={`flex justify-center items-center w-full cursor-pointer ${
                            uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}>
                        <div className='flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4'>
                            <Upload className='w-8 h-8 md:w-10 md:h-10 text-gray-500 dark:text-gray-100 p-2 border border-dashed border-gray-200
                            rounded-xl'/>
                            <p className='text-xs md:text-base text-center'>{uploading ? 'Uploading...' : 'Upload images (PNG, JPG up to 10 mb)'}</p>
                        </div>
                    </label>
                </div>

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                    <div className='space-y-2 my-2'>
                        {Object.entries(uploadProgress).map(([fileName, status]) => (
                            <div key={fileName} className='flex justify-between items-center py-2 px-4 
                                border border-gray-200 dark:border-gray-700 dark:text-gray-100 rounded-xl'>
                                <span className='text-xs md:text-sm truncate'>{fileName}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                    status === 'uploading' ? 'bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-200' :
                                    status === 'completed' ? 'bg-green-100 dark:bg-gray-700 text-green-800 dark:text-green-200' :
                                    'bg-red-100 dark:bg-gray-700 text-red-800 dark:text-red-200'
                                }`}>
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Image Preview Grid */}
                {buildingImages.length > 0 && (
                    <div className='space-y-4 my-6'>
                        <h3 className='font-semibold text-gray-500 dark:text-gray-300 text-sm md:text-base'>Uploaded Images:</h3>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4'>
                            {buildingImages.map((imageUrl, index) => (
                                <div key={index} className='relative group'>
                                    <img
                                        src={imageUrl}
                                        alt={`Upload ${index + 1}`}
                                        className='w-full h-24 md:h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700'
                                    />
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeImage(index)}
                                        className='absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 rounded-xl
                                        opacity-0 group-hover:opacity-100 transition-opacity'
                                    >
                                        <X size={14} className='md:w-4 md:h-4' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className='p-3 md:p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 
                        text-red-700 dark:text-red-300 rounded-xl text-sm md:text-base'>
                        {error}
                    </div>
                )}

                <div className='flex justify-between gap-2'>
                    <button className='border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700
                        rounded-xl py-2 px-4 md:px-6 cursor-pointer dark:text-gray-100 text-sm md:text-base'
                        onClick={() => resetFormData()}>
                        Clear
                    </button>
                    <button className='bg-lime-300 hover:bg-lime-400 rounded-xl py-2 px-4 md:px-6 cursor-pointer text-sm md:text-base font-medium'
                        onClick={(e) => {handleSubmit(e);navigate("/")}}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}


export default AddPage