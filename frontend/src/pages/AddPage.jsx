import { Plus, Minus, Upload, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useRentadStore } from '../stores/useRentadStore'
import { useLocation, useNavigate } from "react-router-dom"
import axios from 'axios'
import { useUserStore } from '../stores/useUserStore'
import { useLocationStore } from '../stores/useLocationStore'

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
    const { createLocation, formLocation, setFormLocation, currentLocation } = useLocationStore()

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const propertyOptions = ['','Apartment','House'];
    const currencyOptions = ['','$', '€', '£', '¥', '₹', '₽']
    const periodOptions = ['','month', 'week', 'day', 'year']
    const unitOptions = ['','m²', 'a', 'h']

    const [selectedAmenities, setSelectedAmenities] = useState([])
    const amenityOptions = [
        'not rieltor', 'lease agreement', 'recently renovated', 'rent includes all fees'
    ]

    const [selectedExtras, setSelectedExtras] = useState([])
    const extraOptions = [
        'wifi', 'tv', 'air conditioning', 'vacuum cleaner', 'fridge', 'washing machine'
    ]

    const handleAmenity = (amenity) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity) ? prev.filter(item => item !== amenity) : [...prev, amenity]
        )
    }

    const handleExtra = (extra) => {
        setSelectedExtras(prev =>
            prev.includes(extra) ? prev.filter(item => item !== extra) : [...prev, extra]
        )
    }
    
    
    useEffect(() => {
        setFormData({ ...formData, amenities: selectedAmenities })
    }, [selectedAmenities]);

    useEffect(() => {
        setFormData({ ...formData, extras: selectedExtras })
    }, [selectedExtras])

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
            // console.log(data);
            
            if (data && data.address) {
                // Create location object with all data at once
                const locationData = {
                    lat: latitude.toString(),
                    lon: longitude.toString(),
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
                setInputLocation(data?.display_name);
                
                await createLocation();
                setTimeout(() => {
                    const { currentLocation } = useLocationStore.getState();
                    if (currentLocation) {
                        console.log(currentLocation)
                        setFormData({ 
                            ...formData, 
                            location_id: currentLocation[0].id,
                            location_display: currentLocation[0].county + ', ' + currentLocation[0].city,
                            user_id: currentUser.id 
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

                // console.log('Response status:', response.status)
                // console.log('Response data:', response.data)
                
                const data = response.data
                
                setBuildingImages(prev => [...prev, data.imageUrl])

                setUploadProgress(prev => ({
                    ...prev,
                    [imageFile.name]: 'completed'
                }))

                // console.log('Upload successful:', data)

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

    return (
        <div className='flex justify-start items-center '>
            <div className='w-[800px] ml-[100px] mt-[50px] p-8 space-y-8'>
                <div className='flex justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4'>
                    <label htmlFor='property' className="text-gray-500">
                    Property
                    </label>
                    
                    <select value={formData?.property} className='outline-none'
                        onChange={(e) => { setFormData({ ...formData, property: e.target.value })}}>
                        {propertyOptions.map(property => (
                            <option key={property} value={property}>{property}</option>
                        ))}
                    </select>
                </div>
                <div className='flex justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4'>
                    <label htmlFor='rent' className='text-gray-500'>Rent</label>
                    <div className='block space-x-2'>
                        <select value={formData?.rent_currency} 
                            onChange={(e) => { setFormData({ ...formData, rent_currency: e.target.value }) }}>
                            {currencyOptions.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                        <span className='text-gray-200'>|</span>
                        <input 
                            type="number"
                            id="rent" name="rent"
                            className="outline-none w-[50px] mx-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                                [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 
                                [&::-webkit-inner-spin-button]:m-0"
                            placeholder='200'
                            value={formData?.rent || ''} 
                            onChange={(e) => { setFormData({ ...formData, rent: e.target.value })}}
                        />
                        <span className='text-gray-200'>|</span>
                        <select value={formData?.rent_period}
                            onChange={(e) => setFormData({ ...formData, rent_period: e.target.value })}>
                            {periodOptions.map(period => (
                                <option key={period} value={period}>{period}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='flex justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4'>
                    <label htmlFor='area' className='text-gray-500'>Area</label>
                    <div>
                        <select value={formData?.area_unit}
                            onChange={(e) => setFormData({ ...formData, area_unit: e.target.value})}>
                            {unitOptions.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        <span className="text-gray-200 mx-2">|</span>
                        <input 
                            type="number"
                            id="area" name="area"
                            className="outline-none w-[50px] appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                                [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 
                                [&::-webkit-inner-spin-button]:m-0"
                            placeholder='80'
                            value={formData?.area || ''}
                            onChange={(e) => { setFormData({ ...formData, area: e.target.value })}}
                        />
                    </div>
                </div>
                <div className='flex justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4'>
                    <label className='text-gray-500'>Bedrooms</label>
                    <div className='flex flex-row justify-center items-center'>
                        <Minus 
                            className='border border-gray-200 rounded-full p-2 w-8 h-8 cursor-pointer hover:bg-gray-100' 
                            onClick={() => updateBedrooms(-1)}
                        />
                        <input className="w-[40px] ml-6 text-center"
                            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                            value={formData.bedrooms}
                        />
                        <Plus 
                            className='border border-gray-200 rounded-full p-2 w-8 h-8 cursor-pointer hover:bg-gray-100' 
                            onClick={() => updateBedrooms(+1)}
                        />
                    </div>
                </div>
                <div className='flex justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4'>
                    <label htmlFor='bathrooms' className='text-gray-500'>Bathrooms</label>
                    <div className='flex flex-row justify-center items-center'>
                        <Minus 
                            className='border border-gray-200 rounded-full p-2 w-8 h-8 cursor-pointer hover:bg-gray-100' 
                            onClick={() => updateBathrooms(-1)}
                        />
                        <input className="w-[40px] ml-6 text-center"
                            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                            value={formData.bathrooms}
                        />
                        <Plus 
                            className='border border-gray-200 rounded-full p-2 w-8 h-8 cursor-pointer hover:bg-gray-100' 
                            onClick={() => updateBathrooms(+1)}
                        />
                    </div>
                </div>
                <div className='border border-gray-200 rounded-[20px] py-2 px-4'>
                    <label htmlFor="" className="text-gray-500">Amenities</label>
                    <div className='flex flex-wrap justify-start items-center gap-6'>
                        {amenityOptions.map(amenity => (
                            <div className='space-x-1' key={amenity}>
                                <input
                                    type="checkbox"
                                    checked={selectedAmenities.includes(amenity)}
                                    id={amenity}
                                    onChange={(e) => handleAmenity(amenity)}
                                    className='cursor-pointer'/>
                                <label htmlFor={amenity}>{amenity}</label>
                            </div>
                        )) }
                    </div>
                </div>
                <div className='border border-gray-200 rounded-[20px] py-2 px-4'>
                    <label htmlFor="" className="text-gray-500">Extras</label>
                    <div className='flex flex-wrap justify-start items-center gap-6'>
                        {extraOptions.map(extra => (
                            <div className='space-x-1' key={extra}>
                                <input
                                    type="checkbox"
                                    checked={selectedExtras.includes(extra)}
                                    id={extra}
                                    onChange={() => handleExtra(extra)}
                                    className='cursor-pointer'/>
                                <label htmlFor={extra}>{extra}</label>
                            </div>
                        )) }
                    </div>
                </div>
                <div className='flex flex-col justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4 gap-2'>
                    <button onClick={() => {getLocation()}} className='border border-gray-200 hover:bg-gray-200 rounded-[10px] py-2 px-4 cursor-pointer w-full'>Get location</button>
                    <input 
                        type='text'
                        className='outline-none overflow-scroll border border-gray-200 rounded-[10px] py-2 px-4 w-full'
                        value={inputLocation || ''}
                        readOnly
                        placeholder='Location will appear here...'
                    />
                </div>
                <div className='flex flex-row justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4'>
                    <label className='text-gray-500'>Enter phone number</label>
                    <input type="text"
                        className='outline-none '
                        placeholder='+998 99 476 29 26'
                        onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}/>
                </div>
                <div className='flex justify-between items-center border border-gray-200 rounded-[10px] py-2 px-4'>
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
                        <div className='flex flex-row justify-center items-center gap-4'>
                            <Upload className='w-10 h-10 text-gray-500 p-2 border border-dashed border-gray-200 rounded-full'/>
                            <p>{uploading ? 'Uploading...' : 'Upload images(PNG, JPG up to 10 mb)'}</p>
                        </div>
                    </label>
                </div>

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                    <div className='space-y-2'>
                        {Object.entries(uploadProgress).map(([fileName, status]) => (
                            <div key={fileName} className='flex justify-between items-center p-2 border border-gray-200 rounded'>
                                <span className='text-sm truncate'>{fileName}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                    status === 'uploading' ? 'bg-blue-100 text-blue-800' :
                                    status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Image Preview Grid */}
                {buildingImages.length > 0 && (
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-gray-500'>Uploaded Images:</h3>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                            {buildingImages.map((imageUrl, index) => (
                                <div key={index} className='relative group'>
                                    <img
                                        src={imageUrl}
                                        alt={`Upload ${index + 1}`}
                                        className='w-full h-32 object-cover rounded-lg border border-gray-200'
                                    />
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeImage(index)}
                                        className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
                        {error}
                    </div>
                )}

                <div className='flex justify-between'>
                    <button className='border border-gray-200 hover:bg-gray-200 rounded-[10px] py-2 px-4'
                        onClick={() => resetFormData()}>
                        Clear
                    </button>
                    <button className='border border-gray-200 hover:bg-gray-200 rounded-[10px] py-2 px-4'
                        onClick={(e) => {handleSubmit(e);navigate("/")}}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}


export default AddPage