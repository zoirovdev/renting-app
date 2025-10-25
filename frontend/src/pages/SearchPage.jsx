import { useState, useRef, useEffect } from 'react'
import { useRentadStore } from '../stores/useRentadStore.js'
import Map from "../components/Map.jsx"
import { Link } from "react-router-dom"
import { MapPin, Wallet, DollarSign, BedDouble, BrushCleaning, Search } from "lucide-react"

const SearchPage = () => {
    
    const { searchRentad, rentads, fetchRentads, loading } = useRentadStore()
    const [searchTerm, setSearchTerm] = useState({
        property: "",
        location_display: "",
        bedrooms: ""
    })

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
    

    

    const loadingRentads = [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 },
        { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 },
    ]

    useEffect(() => {
        fetchRentads()
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

            console.log(searchTerm)
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
        await fetchRentads()
    }
    
    return (
        <div className='flex flex-col gap-4 md:gap-8 px-4 md:px-[110px] py-4 pb-20 md:pb-8'>
            {/* Filters Section */}
            <div className='flex flex-col gap-2'>
                

                {/* Desktop Filters - Horizontal */}
                <div className='hidden md:flex p-1 justify-center items-center 
                    dark:bg-gray-800 dark:text-gray-50 mx-auto gap-1'>
                    {/* Clear Filters Button */}
                    <button 
                        className="border dark:border-none border-gray-200 dark:bg-gray-800
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base flex justify-center items-center gap-1"
                        onClick={handleClearFilters}>
                        <BrushCleaning className="w-4 h-4"/>
                        <p>Clear filters</p>
                    </button>

                    {/* Property Type Dropdown */}
                    <div className='relative' >
                        <button 
                            className='border dark:border-none border-gray-200 dark:bg-gray-800
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base' 
                            onClick={() => setIsPropertyOpen(!isPropertyOpen)}>
                            <span>{searchTerm.property || "Property type"}</span>
                        </button>
                        
                        {isPropertyOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[200px] bg-gray-50 dark:bg-gray-800 
                                text-gray-900 dark:text-gray-50 rounded-xl shadow-xl max-h-60 overflow-auto z-[9999]">
                                {propertyOptions.map(option => (
                                    <div key={option}
                                        onClick={() => {
                                            setSearchTerm({ ...searchTerm, property: option })
                                            setIsPropertyOpen(!isPropertyOpen)
                                        }}
                                        className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                                            transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location Dropdown */}
                    {/* <div className='relative' >
                        <button 
                            className='border dark:border-none border-gray-200 dark:bg-gray-800
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base' 
                            onClick={() => setIsLocationOpen(!isLocationOpen)}>
                            <span>{searchTerm.location_display || "Location"}</span>
                        </button>
                        
                        {isLocationOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[200px] bg-gray-50 dark:bg-gray-800 
                                text-gray-900 dark:text-gray-50 rounded-xl shadow-xl max-h-60 overflow-auto z-[9999]">
                                {locationOptions.map(option => (
                                    <div key={option}
                                        onClick={() => {
                                            setSearchTerm({ ...searchTerm, location_display: option })
                                            setIsLocationOpen(false)
                                        }}
                                        className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                                            transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}

                    {/* Rent Range */}
                    <div className='relative' >
                        <button 
                            className='border dark:border-none border-gray-200 dark:bg-gray-800
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base' 
                            onClick={() => setShowRentRange(!showRentRange)}>
                            <span>
                                {rentRange.min === 0 && rentRange.max === 5000 
                                    ? "Rent" 
                                    : `$${rentRange.min} - $${rentRange.max}`}
                            </span>
                        </button>
                        
                        {showRentRange && (
                            <div className="absolute top-full left-0 mt-2 w-[300px] bg-gray-50 dark:bg-gray-800
                                text-gray-900 dark:text-gray-50 rounded-xl shadow-xl p-6 z-[9999]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-50 mb-2 block">
                                            Min: ${rentRange.min}
                                        </label>
                                        <input type="range" min="0" max="5000" step="100" value={rentRange.min}
                                            onChange={(e) => setRentRange({ ...rentRange, min: Math.min(Number(e.target.value), rentRange.max - 100)})}
                                            className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-50 mb-2 block">
                                            Max: ${rentRange.max}
                                        </label>
                                        <input type="range" min="0" max="5000" step="100" value={rentRange.max}
                                            onChange={(e) => setRentRange({ ...rentRange, max: Math.max(Number(e.target.value), rentRange.min + 100)})}
                                            className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                    </div>
                                    <button onClick={() => setShowRentRange(false)}
                                        className="w-full py-2 bg-lime-300 hover:bg-lime-400 dark:text-gray-900 rounded-xl transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Area Range */}
                    <div className='relative' >
                        <button 
                            className='border dark:border-none border-gray-200 dark:bg-gray-800
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base' 
                            onClick={() => setShowAreaRange(!showAreaRange)}>
                            <span>
                                {areaRange.min === 0 && areaRange.max === 500 
                                    ? "Area" 
                                    : `${areaRange.min} - ${areaRange.max} sqm`}
                            </span>
                        </button>
                        
                        {showAreaRange && (
                            <div className="absolute top-full left-0 mt-2 w-[300px] bg-gray-50 dark:bg-gray-800 
                                text-gray-900 dark:text-gray-50 rounded-xl shadow-xl p-6 z-[9999]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-50 mb-2 block">
                                            Min: {areaRange.min} sqm
                                        </label>
                                        <input type="range" min="0" max="500" step="10" value={areaRange.min}
                                            onChange={(e) => setAreaRange({ ...areaRange, min: Math.min(Number(e.target.value), areaRange.max - 10)})}
                                            className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-50 mb-2 block">
                                            Max: {areaRange.max} sqm
                                        </label>
                                        <input type="range" min="0" max="500" step="10" value={areaRange.max}
                                            onChange={(e) => setAreaRange({ ...areaRange, max: Math.max(Number(e.target.value), areaRange.min + 10)})}
                                            className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                    </div>
                                    <button onClick={() => setShowAreaRange(false)}
                                        className="w-full py-2 bg-lime-300 hover:bg-lime-400 dark:text-gray-900 rounded-xl transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bedrooms Dropdown */}
                    <div className='relative' >
                        <button 
                            className='border dark:border-none border-gray-200 dark:bg-gray-800
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base' 
                            onClick={() => setIsBedroomsOpen(!isBedroomsOpen)}>
                            <span>{searchTerm.bedrooms ? `${searchTerm.bedrooms} room${searchTerm.bedrooms !== '1' ? 's' : ''}` : "Bedrooms"}</span>
                        </button>
                        
                        {isBedroomsOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[200px] bg-gray-50 dark:bg-gray-800 
                                text-gray-900 dark:text-gray-50 rounded-xl shadow-xl max-h-60 overflow-auto z-[9999]">
                                {bedroomOptions.map(option => (
                                    <div key={option}
                                        onClick={() => {
                                            setSearchTerm({ ...searchTerm, bedrooms: option })
                                            setIsBedroomsOpen(false)
                                        }}
                                        className="py-3 px-4 hover:bg-lime-50 dark:hover:bg-gray-700 cursor-pointer
                                            transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                        {option} {option === '1' ? 'Bedroom' : 'Bedrooms'}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button 
                        className='cursor-pointer py-2 px-4 bg-lime-300 text-gray-900
                            hover:bg-lime-400 rounded-xl shadow-xl transition-colors whitespace-nowrap
                            flex justify-center items-center gap-1' 
                        onClick={handleSearch}>
                        <p>Search</p>
                        <Search className="w-4 h-4"/>
                    </button>
                </div>

                {/* Mobile Filters - Vertical Stacked */}
                <div className='md:hidden flex flex-col gap-2'>
                    <button 
                        className="w-full md:w-auto md:self-center border dark:border-none border-gray-100 dark:bg-gray-800 shadow-xl
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-3 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base flex justify-center items-center gap-1"
                        onClick={handleClearFilters}>
                        <BrushCleaning className='w-4 h-4'/>
                        <p>Clear filters</p>
                    </button>
                    <div className='border dark:border-none border-gray-100 rounded-xl p-3 shadow-xl
                        dark:bg-gray-800 dark:text-gray-50 flex flex-col gap-2'>
                        
                        {/* Property Type - Mobile */}
                        <div className='relative' >
                            <button 
                                className='w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 rounded-xl
                                    text-left flex items-center justify-between text-sm'
                                onClick={() => setIsPropertyOpen(!isPropertyOpen)}>
                                <span>{searchTerm.property || "Property type"}</span>
                            </button>
                            {isPropertyOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-gray-50 dark:bg-gray-800 
                                    rounded-xl shadow-xl max-h-60 overflow-auto z-[9999]">
                                    {propertyOptions.map(option => (
                                        <div key={option}
                                            onClick={() => {
                                                setSearchTerm({ ...searchTerm, property: option })
                                                setIsPropertyOpen(false)
                                            }}
                                            className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                                                text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-700 last:border-b-0 text-sm">
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Location - Mobile */}
                        <div className='relative' >
                            <button 
                                className='w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 rounded-xl
                                    text-left flex items-center justify-between text-sm'
                                onClick={() => setIsLocationOpen(!isLocationOpen)}>
                                <span>{searchTerm.location_display || "Location"}</span>
                            </button>
                            {isLocationOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-gray-50 dark:bg-gray-800 
                                    rounded-xl shadow-xl max-h-60 overflow-auto z-[9999]">
                                    {locationOptions.map(option => (
                                        <div key={option}
                                            onClick={() => {
                                                setSearchTerm({ ...searchTerm, location_display: option })
                                                setIsLocationOpen(false)
                                            }}
                                            className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                                                text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-700 last:border-b-0 text-sm">
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rent Range - Mobile */}
                        <div className='relative' >
                            <button 
                                className='w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 rounded-xl
                                    text-left flex items-center justify-between text-sm'
                                onClick={() => setShowRentRange(!showRentRange)}>
                                <span>
                                    {rentRange.min === 0 && rentRange.max === 5000 
                                        ? "Rent" 
                                        : `$${rentRange.min} - $${rentRange.max}`}
                                </span>
                            </button>
                            {showRentRange && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-gray-50 dark:bg-gray-800
                                    rounded-xl shadow-xl p-4 z-[9999] text-gray-900 dark:text-gray-50">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm mb-2 block">Min: ${rentRange.min}</label>
                                            <input type="range" min="0" max="5000" step="100" value={rentRange.min}
                                                onChange={(e) => setRentRange({ ...rentRange, min: Math.min(Number(e.target.value), rentRange.max - 100)})}
                                                className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                        </div>
                                        <div>
                                            <label className="text-sm mb-2 block">Max: ${rentRange.max}</label>
                                            <input type="range" min="0" max="5000" step="100" value={rentRange.max}
                                                onChange={(e) => setRentRange({ ...rentRange, max: Math.max(Number(e.target.value), rentRange.min + 100)})}
                                                className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                        </div>
                                        <button onClick={() => setShowRentRange(false)}
                                            className="w-full py-2 bg-lime-300 hover:bg-lime-400 text-gray-900 rounded-xl text-sm">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Area Range - Mobile */}
                        <div className='relative' >
                            <button 
                                className='w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 rounded-xl
                                    text-left flex items-center justify-between text-sm'
                                onClick={() => setShowAreaRange(!showAreaRange)}>
                                <span>
                                    {areaRange.min === 0 && areaRange.max === 500 
                                        ? "Area" 
                                        : `${areaRange.min} - ${areaRange.max} sqm`}
                                </span>
                            </button>
                            {showAreaRange && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-gray-50 dark:bg-gray-800
                                    rounded-xl shadow-xl p-4 z-[9999] text-gray-900 dark:text-gray-50">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm mb-2 block">Min: {areaRange.min} sqm</label>
                                            <input type="range" min="0" max="500" step="10" value={areaRange.min}
                                                onChange={(e) => setAreaRange({ ...areaRange, min: Math.min(Number(e.target.value), areaRange.max - 10)})}
                                                className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                        </div>
                                        <div>
                                            <label className="text-sm mb-2 block">Max: {areaRange.max} sqm</label>
                                            <input type="range" min="0" max="500" step="10" value={areaRange.max}
                                                onChange={(e) => setAreaRange({ ...areaRange, max: Math.max(Number(e.target.value), areaRange.min + 10)})}
                                                className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-lime-400"/>
                                        </div>
                                        <button onClick={() => setShowAreaRange(false)}
                                            className="w-full py-2 bg-lime-300 hover:bg-lime-400 text-gray-900 rounded-xl text-sm">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bedrooms - Mobile */}
                        <div className='relative' >
                            <button 
                                className='w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 rounded-xl
                                    text-left flex items-center justify-between text-sm'
                                onClick={() => setIsBedroomsOpen(!isBedroomsOpen)}>
                                <span>{searchTerm.bedrooms ? `${searchTerm.bedrooms} bed${searchTerm.bedrooms !== '1' ? 's' : ''}` : "Bedrooms"}</span>
                            </button>
                            {isBedroomsOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-gray-50 dark:bg-gray-800 
                                    rounded-xl shadow-xl max-h-60 overflow-auto z-[9999]">
                                    {bedroomOptions.map(option => (
                                        <div key={option}
                                            onClick={() => {
                                                setSearchTerm({ ...searchTerm, bedrooms: option })
                                                setIsBedroomsOpen(false)
                                            }}
                                            className="py-3 px-4 hover:bg-lime-50 dark:hover:bg-gray-700 cursor-pointer
                                                text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-700 last:border-b-0 text-sm">
                                            {option} {option === '1' ? 'Bedroom' : 'Bedrooms'}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Button - Mobile */}
                    <button 
                        className='w-full py-3 px-4 bg-lime-300 hover:bg-lime-400 text-gray-900
                            rounded-xl shadow-xl transition-colors font-medium flex justify-center items-center gap-1' 
                        onClick={handleSearch}>
                        <p>Search</p>
                        <Search className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {/* Map */}
            <Map />

            {/* Results */}
            {loading 
            ? <div className='flex flex-wrap justify-center md:justify-start items-center gap-4'>
                {loadingRentads.map(load => (
                <div key={load.id} 
                    className='flex flex-col justify-start w-full sm:w-[calc(50%-0.5rem)] lg:w-[300px] h-[400px] gap-1 pb-4 animate-pulse'>
                    <div className='w-full h-[200px] bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
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
                        <div className="flex flex-row justify-start items-center gap-2 w-full">
                            <div className='w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded'></div>
                            <div className='h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded'></div>
                        </div>
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
            ? <div className='flex flex-col justify-center items-center mt-10 md:mt-20'>
                <div className='text-gray-400 dark:text-gray-500 text-center'>
                    <p className='text-6xl mb-4'>🏠</p>
                    <p className='text-xl font-semibold mb-2'>No properties found</p>
                    <p className='text-gray-500 dark:text-gray-400'>Try adjusting your search filters</p>
                </div>
            </div>
            : <div className='flex flex-wrap justify-center md:justify-start items-center gap-4 px-1'>
                {rentads.map((rentad) => (
                <Link to={`/detail/${rentad.id}`} key={rentad.id} 
                    className='flex flex-col justify-start w-full sm:w-[calc(50%-0.5rem)] lg:w-[300px] h-[400px] gap-1 pb-4'>
                    {rentad.images.length && 
                    <div className='w-full'>
                        <img src={rentad.images[0]} alt="" className='object-cover w-full h-[200px] rounded-xl'/>  
                    </div>}
                    <div className='grid grid-cols-1 py-2 px-4 gap-2'>
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-col'>
                                <p className='font-semibold tracking-wider dark:text-gray-50 text-sm md:text-base'>{rentad.property}</p>
                                <p className='dark:text-gray-50 text-xs md:text-sm'>{rentad.bedrooms} <span className='text-gray-500 dark:text-gray-300'>{rentad.bedrooms > 1 ? "rooms" : "room"}</span> • {rentad.area} <span className='text-gray-500 dark:text-gray-300'>{rentad.area_unit}</span></p>
                            </div>
                            <div className='flex flex-col dark:text-gray-50'>
                                <p className='text-lime-500 text-sm md:text-base'>{rentad.rent_currency}{(rentad.rent).toString().split('.')[0]}</p>
                                <p className='dark:text-gray-300 text-xs md:text-sm'>{rentad.rent_period}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2 w-full">
                            <MapPin className='w-4 h-4 text-orange-600'/>
                            <p className='dark:text-gray-50 text-xs md:text-sm'>{rentad.location_display}</p>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            {rentad.offers && rentad.offers.slice(0, 4).map(offer => (
                                <p key={offer} 
                                    className="border border-blue-400 rounded-xl px-2 text-xs md:text-sm text-gray-600
                                    dark:text-gray-300">
                                    {offer}
                                </p>
                            ))}
                            {rentad.offers.length > 4 && (
                                <p className="border border-blue-400 rounded-xl px-2 text-xs md:text-sm text-gray-600
                                dark:text-gray-300">
                                +{rentad.offers.length - 4} more
                                </p>
                            )}
                        </div>
                    </div>
                </Link>
                ))}
            </div>}
        </div>
    )
}

export default SearchPage