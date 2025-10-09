import { useState, useRef, useEffect } from 'react'
import { useRentadStore } from '../stores/useRentadStore.js'
import { Search } from 'lucide-react'
import Map from "../components/Map.jsx"
import { Link } from "react-router-dom"
import { MapPin, Wallet, DollarSign, BedDouble } from "lucide-react"

const SearchPage = () => {
    const { searchRentad, rentads, fetchRentads } = useRentadStore()
    const [searchTerm, setSearchTerm] = useState({})


    const [rentRange, setRentRange] = useState({ min: 0, max: 5000 })
    const [areaRange, setAreaRange] = useState({ min: 0, max: 500 })
    
    // Dropdown options
    const propertyOptions = ['Apartment', 'House']
    const locationOptions = ['Yangihayot', 'Sergeli', 'Chilonzor', 'Yakkasaroy', 'Shayhontohur', 'Mirobod', 'Yunusobod', 'Olmazor']
    const bedroomOptions = ['1', '2', '3', '4', '5+']
    
    // Dropdown states
    const [isPropertyOpen, setIsPropertyOpen] = useState(false)
    const [isLocationOpen, setIsLocationOpen] = useState(false)
    const [showRentRange, setShowRentRange] = useState(false)
    const [showAreaRange, setShowAreaRange] = useState(false)
    const [isBedroomsOpen, setIsBedroomsOpen] = useState(false)
    
    // Refs for click outside
    const propertyRef = useRef(null)
    const locationRef = useRef(null)
    const rentRef = useRef(null)
    const areaRef = useRef(null)
    const bedroomsRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (propertyRef.current && !propertyRef.current.contains(event.target)) {
                setIsPropertyOpen(false)
            }
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setIsLocationOpen(false)
            }
            if (rentRef.current && !rentRef.current.contains(event.target)) {
                setShowRentRange(false)
            }
            if (areaRef.current && !areaRef.current.contains(event.target)) {
                setShowAreaRange(false) 
            }
            if (bedroomsRef.current && !bedroomsRef.current.contains(event.target)) {
                setIsBedroomsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    
    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            const params = new URLSearchParams()
            let count = 0
            
            if (searchTerm.property) {
                params.append('property', searchTerm.property)
            } else {
                count += 1
            }
            
            if (searchTerm.location_display) {
                params.append('location_display', searchTerm.location_display)
            } else {
                count += 1
            }

            if(rentRange.min || rentRange.max){
                if (rentRange.min > 0) {
                    params.append('minRent', rentRange.min)
                }
    
                if (rentRange.max < 5000) {
                    params.append('maxRent', rentRange.max)
                }
            } else {
                count+=1
            }

            if(areaRange.min || areaRange.max){
                if (areaRange.min > 0) {
                    params.append('minArea', areaRange.min)
                }
    
                if (areaRange.max < 500) { 
                    params.append('maxArea', areaRange.max) 
                }
            } else {
                count+=1
            }

            
            if (searchTerm.bedrooms) {
                params.append('bedrooms', searchTerm.bedrooms)
            } else {
                count += 1
            }

            if(count === 5) return

            await searchRentad(params)
        } catch (err) {
            console.log("Error ", err)
        }
    }

    const handleClearFilters = async () => {
        setSearchTerm({
            property: "",
            location_display: "",
            bedrooms: ""
        })
        setRentRange({ min: 0, max: 5000 })
        setAreaRange({ min: 0, max: 500 })
    }
    
    return (
        <div className='mt-[80px] ml-[100px] mr-[100px] space-y-8'>
            <div className='flex justify-center items-center gap-2'>
                <button className="border border-gray-100 shadow-md hover:bg-gray-100 py-3 px-4 rounded-full
                    cursor-pointer"
                    onClick={handleClearFilters}>
                    Clear filters
                </button>
                <div className='border border-gray-100 rounded-full p-1 shadow-md flex justify-center items-center
                    focus-within:bg-gray-100 focus-within:text-gray-500'>

                    {/* Property Type Dropdown */}
                    <div className='relative' ref={propertyRef}>
                        <button 
                            className='outline-none w-full py-2 px-4  cursor-pointer focus:bg-white focus:text-black
                                focus:rounded-full focus:shadow-lg flex items-center justify-between gap-2 whitespace-nowrap' 
                            onClick={() => setIsPropertyOpen(!isPropertyOpen)}
                        >
                            <span>{searchTerm.property || "Property type"}</span>
                        </button>
                        
                        {isPropertyOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[200px] bg-white text-black rounded-lg shadow-lg 
                                max-h-60 overflow-auto z-[9999]">
                                {propertyOptions.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setSearchTerm({ ...searchTerm, property: option })
                                            setIsPropertyOpen(false)
                                        }}
                                        className="py-3 px-4 hover:bg-gray-50 cursor-pointer
                                            transition-colors border-b border-gray-200 last:border-b-0"
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location Dropdown */}
                    <div className='relative' ref={locationRef}>
                        <button 
                            className='outline-none w-full py-2 px-4 cursor-pointer focus:text-black
                                focus:rounded-full focus:shadow-lg focus:bg-white flex items-center justify-between gap-2 whitespace-nowrap' 
                            onClick={() => setIsLocationOpen(!isLocationOpen)}
                        >
                            <span>{searchTerm.location_display || "Location"}</span>
                        </button>
                        
                        {isLocationOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[200px] bg-white text-black rounded-lg shadow-lg 
                                max-h-60 overflow-auto z-[9999]">
                                {locationOptions.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setSearchTerm({ ...searchTerm, location_display: option })
                                            setIsLocationOpen(false)
                                        }}
                                        className="py-3 px-4 hover:bg-lime-50 cursor-pointer
                                            transition-colors border-b border-gray-200 last:border-b-0"
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rent Range */}
                    <div className='relative' ref={rentRef}>
                        <button 
                            className='outline-none w-full py-2 px-4 cursor-pointer focus:text-black
                                focus:rounded-full focus:shadow-lg focus:bg-white flex items-center justify-between gap-2 whitespace-nowrap' 
                            onClick={() => setShowRentRange(!showRentRange)}
                        >
                            <span>
                                {rentRange.min === 0 && rentRange.max === 5000 
                                    ? "Rent" 
                                    : `$${rentRange.min} - $${rentRange.max}`}
                            </span>
                        </button>
                        
                        {showRentRange && (
                            <div className="absolute top-full left-0 mt-2 w-[300px] bg-white text-black rounded-lg shadow-lg 
                                p-6 z-[9999]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">
                                            Min: ${rentRange.min}
                                        </label>
                                        <input 
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="100"
                                            value={rentRange.min}
                                            onChange={(e) => { 
                                                setRentRange({ ...rentRange, min: Math.min(Number(e.target.value), rentRange.max - 100)});
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">
                                            Max: ${rentRange.max}
                                        </label>
                                        <input 
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="100"
                                            value={rentRange.max}
                                            onChange={(e) => {
                                                setRentRange({ ...rentRange, max: Math.max(Number(e.target.value), rentRange.min + 100)});
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-400"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowRentRange(false)}
                                        className="w-full py-2 bg-lime-300 hover:bg-lime-400 rounded-lg transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Area Range */}
                    <div className='relative' ref={areaRef}>
                        <button 
                            className='outline-none w-full py-2 px-4 cursor-pointer focus:text-black
                                focus:rounded-full focus:shadow-lg focus:bg-white flex items-center justify-between gap-2 whitespace-nowrap' 
                            onClick={() => setShowAreaRange(!showAreaRange)}
                        >
                            <span>
                                {areaRange.min === 0 && areaRange.max === 500 
                                    ? "Area" 
                                    : `${areaRange.min} - ${areaRange.max} sqm`}
                            </span>
                        </button>
                        
                        {showAreaRange && (
                            <div className="absolute top-full left-0 mt-2 w-[300px] bg-white text-black rounded-lg shadow-lg 
                                p-6 z-[9999]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">
                                            Min: {areaRange.min} sqm
                                        </label>
                                        <input 
                                            type="range"
                                            min="0"
                                            max="500"
                                            step="10"
                                            value={areaRange.min}
                                            onChange={(e) => setAreaRange({ 
                                                ...areaRange, 
                                                min: Math.min(Number(e.target.value), areaRange.max - 10)
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">
                                            Max: {areaRange.max} sqm
                                        </label>
                                        <input 
                                            type="range"
                                            min="0"
                                            max="500"
                                            step="10"
                                            value={areaRange.max}
                                            onChange={(e) => setAreaRange({ 
                                                ...areaRange, 
                                                max: Math.max(Number(e.target.value), areaRange.min + 10)
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-400"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowAreaRange(false)}
                                        className="w-full py-2 bg-lime-300 hover:bg-lime-400 rounded-lg transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bedrooms Dropdown */}
                    <div className='relative' ref={bedroomsRef}>
                        <button 
                            className='outline-none w-full py-2 px-4 cursor-pointer focus:text-black
                                focus:rounded-full focus:shadow-lg focus:bg-white flex items-center justify-between gap-2 whitespace-nowrap' 
                            onClick={() => setIsBedroomsOpen(!isBedroomsOpen)}
                        >
                            <span>{searchTerm.bedrooms ? `${searchTerm.bedrooms} bed${searchTerm.bedrooms !== '1' ? 's' : ''}` : "Bedrooms"}</span>
                        </button>
                        
                        {isBedroomsOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[200px] bg-white text-black rounded-lg shadow-lg 
                                max-h-60 overflow-auto z-[9999]">
                                {bedroomOptions.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setSearchTerm({ ...searchTerm, bedrooms: option })
                                            setIsBedroomsOpen(false)
                                        }}
                                        className="py-3 px-4 hover:bg-lime-50 cursor-pointer
                                            transition-colors border-b border-gray-200 last:border-b-0"
                                    >
                                        {option} {option === '1' ? 'Bedroom' : 'Bedrooms'}
                                    </div>
                                ))}
                            </div>
                        )}

                        
                    </div>

                    <button 
                        className='cursor-pointer py-2 px-4 bg-lime-300 opacity-100 text-black hover:bg-lime-400 rounded-full shadow-md 
                            transition-colors whitespace-nowrap ml-1' 
                        onClick={(e) => handleSearch(e)}>
                        Search
                    </button>
                </div>
                
            </div>

            <Map />
            
            <div className='flex flex-wrap justify-start items-center gap-2'>
                {rentads.length > 0 && rentads.map((rentad) => (
                    <Link to={`/detail/${rentad.id}`} key={rentad.id} 
                        className='flex flex-col justify-start w-[300px] h-[370px] gap-1'>
                        {rentad.images.length > 0 && 
                        <div className='w-full'>
                            <img src={rentad.images[0]} alt="" className='object-cover w-[300px] h-[200px]'/>  
                        </div>}
                        <div className='grid grid-cols-1 py-2 px-4 gap-2'>
                            <div className='flex justify-between items-center'>
                                <div className='flex flex-col'>
                                    <p className='font-semibold tracking-wider'>{rentad.property}</p>
                                    <p className=''>{rentad.bedrooms} <span className='text-gray-500'>{rentad.bedrooms > 1 ? "rooms" : "room"}</span> • {rentad.bathrooms} <span className='text-gray-500'>{rentad.bathrooms > 1 ? "baths" : "bath"}</span></p>
                                </div>
                                <div className='flex flex-col '>
                                    <p className='text-lime-500'>{rentad.rent_currency}{(rentad.rent).toString().split('.')[0]}</p>
                                    <p>{rentad.rent_period}</p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-start items-center gap-2 w-full">
                                <MapPin className='w-4 h-4 text-orange-600'/>
                                <p>{rentad.location_display}</p>
                            </div>
                            <div className='flex flex-wrap gap-1'>
                                {rentad.offers && rentad.offers.map(offer => (
                                    <p key={offer} className="border border-blue-400 rounded-full px-2 text-sm text-gray-600">{offer}</p>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SearchPage