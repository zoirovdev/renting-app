import { useState, useEffect } from 'react'
import { useRentadStore } from '../stores/useRentadStore.js'
import Map from "../components/Map.jsx"
import { Link } from "react-router-dom"
import { MapPin, BrushCleaning, Search, X, Bed, Minus, Plus, HandCoins, House, Coins, Scan, Funnel } from "lucide-react"
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import "../rangeSlider.css"



const SearchPage = () => {
    
    const { rentads, fetchRentads, loading, filterRentad, searchRentad } = useRentadStore()
    const [searchTerm, setSearchTerm] = useState({
        property: "",
        bedrooms: 0,
        offers: []
    })
    const [location, setLocation] = useState("")

    const [rentRange, setRentRange] = useState([0, 5000])
    const [areaRange, setAreaRange] = useState([0, 500])


    const [isFilterOpen, setIsFilterOpen] = useState(false)
    
    const [selectedOffers, setSelectedOffers] = useState([])
    const offerOptions = [
        'lease agreement', 'recently renovated', 'rent includes all fees', 
        'wifi', 'tv', 'air conditioning', 'vacuum cleaner', 'fridge', 'washing machine'
    ]

    const updateBedrooms = (val) => {
        const newValue = searchTerm.bedrooms + val
        if(newValue >= 0 && newValue <= 20){
            setSearchTerm({ ...searchTerm, bedrooms: newValue })
        }
    }
    

    const loadingRentads = [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 },
        { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 },
    ]

    useEffect(() => {
        fetchRentads()
    }, [])

    useEffect(() => {
        setSearchTerm({ ...searchTerm, offers: selectedOffers })
    }, [selectedOffers])


    const handleOffer = (offer) => {
        setSelectedOffers(prev =>
            prev.includes(offer) ? prev.filter(item => item !== offer) : [...prev, offer]
        )
    }

    const handleFilter = async (e) => {
        e.preventDefault()
        try {
            if(searchTerm.bedrooms===0 && searchTerm.property==='' && searchTerm.offers.length===0 && selectedOffers.length===0 && rentRange[0]===0 && rentRange[1]===5000 && areaRange[0]===0 && areaRange[1]===500){
                console.log("handleFilter")
                return 
            }

            const filters = {
                offers: selectedOffers,
                property: searchTerm.property,
                bedrooms: searchTerm.bedrooms,
                minRent: rentRange[0],
                maxRent: rentRange[1],
                minArea: areaRange[0],
                maxArea: areaRange[1]
            }

            setSearchTerm(filters)

            setIsFilterOpen(!isFilterOpen)

            await filterRentad(searchTerm)
        } catch (err) {
            console.log(err)
        }
    }    
    
    
    const handleClearFilters = async () => {
        setSearchTerm({
            property: "",
            bedrooms: 0,
            offers: []
        })
        setRentRange([0, 5000])
        setAreaRange([0, 500])
        setIsFilterOpen(!isFilterOpen)
        await fetchRentads()
    }
    
    const handleSearchByLocation = async (e) => {
        e.preventDefault()

        try {
            if(location===""){
                return
            }

            await searchRentad(location)
        } catch (err) {
            console.log("Error -> ", err)
        }
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
                        onClick={(e) => setIsFilterOpen(!isFilterOpen)}>
                        <Funnel className="w-4 h-4"/>
                        <p>Filters</p>
                    </button>

                    <input type="text" 
                        className="border border-gray-200 rounded-xl py-2 px-4 focus:outline-1 focus:outline-lime-400
                            md:w-[500px] "
                        placeholder="🔍 Where"
                        onChange={(e) => setLocation(e.target.value)}/>

                    <button 
                        className='cursor-pointer py-2 px-4 bg-lime-300 text-gray-900
                            hover:bg-lime-400 rounded-xl transition-colors whitespace-nowrap
                            flex justify-center items-center gap-1' 
                        onClick={(e) => handleSearchByLocation(e)}
                        >
                        <p>Search</p>
                        <Search className="w-4 h-4"/>
                    </button>
                </div>

                {/* Mobile Filters - Vertical Stacked */}
                <div className='md:hidden flex flex-col gap-2'>
                    <button 
                        className="w-full md:w-auto md:self-center border dark:border-none border-gray-100 dark:bg-gray-800
                            hover:bg-gray-100 dark:hover:bg-gray-700 py-3 px-4 rounded-xl cursor-pointer
                            dark:text-gray-50 text-sm md:text-base flex justify-center items-center gap-1"
                        onClick={(e) => setIsFilterOpen(!isFilterOpen)}>
                        <Funnel className='w-4 h-4'/>
                        <p>Filters</p>
                    </button>
                    
                    <input type="text" 
                        className="border border-gray-100 rounded-xl py-2 px-4 focus:outline-1 focus:outline-lime-400"
                        placeholder="🔍 Where"
                        onChange={(e) => setLocation(e.target.value)}/>

                    {/* Search Button - Mobile */}
                    <button 
                        className='w-full py-3 px-4 bg-lime-300 hover:bg-lime-400 text-gray-900
                            rounded-xl shadow-xl transition-colors font-medium flex justify-center items-center gap-1' 
                        onClick={(e) => handleSearchByLocation(e)}
                        >
                        <p>Search</p>
                        <Search className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {isFilterOpen && (
                <div className="fixed inset-0 z-50 backdrop-blur-md bg-opacity-50 flex justify-center items-center">
                    <div className="w-[90%] md:w-[600px] bg-gray-50 flex flex-col  rounded-xl">
                        <div className='flex justify-between items-center border-b border-gray-400 p-4'>
                            <p className="tracking-wider text-lg font-semibold">Filters</p>
                            <X className="w-8 h-8 hover:bg-gray-200 rounded-xl p-2"
                                onClick={(e) => setIsFilterOpen(!isFilterOpen)}/>
                        </div>
                        <div className='px-2'>
                            <div className="border-b border-gray-300 py-4 px-2 space-y-1">
                                <div className="flex justify-start items-center gap-1">
                                    <House className="w-4 h-4 dark:text-gray-100"/>
                                    <p className="">Property</p>
                                </div>
                                <div className="flex w-full gap-1">
                                    <button
                                        className={`basis-1/2 border border-gray-200 flex justify-center items-center p-2 rounded-xl cursor-pointer
                                            ${searchTerm.property==="Apartment" ? "ring-2 ring-lime-400" : ""}`}
                                        onClick={() => {setSearchTerm({ ...searchTerm, property: 'Apartment' }); }}>
                                        Apartment
                                    </button>
                                    <button
                                        className={`basis-1/2 border border-gray-200 flex justify-center items-center p-2 rounded-xl cursor-pointer
                                            ${searchTerm.property==="House" ? "ring-2 ring-lime-400" : ""}`}
                                        onClick={() => {setSearchTerm({ ...searchTerm, property: 'House' });}}>
                                        House
                                    </button>
                                </div>
                            </div>
                            <div className="border-b border-gray-200 py-4 px-2">
                                <div className="flex justify-start items-center gap-1">
                                    <Coins className="w-4 h-4"/>
                                    <p>Rent</p>
                                </div>
                                <div className="space-y-4 mt-2">
                                    <RangeSlider
                                        value={rentRange}
                                        onInput={setRentRange}
                                        min={0}
                                        max={5000}
                                        className='range-slider-custom'
                                    />
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <label htmlFor="">Min</label>
                                            <input type="number"
                                                className='outline-none w-[80px] p-2 rounded-xl border border-gray-200'
                                                value={rentRange[0]}
                                                onChange={(e) => setRentRange([e.target.value, rentRange[1]])}
                                                />
                                        </div>
                                        <div className='flex flex-col justify-center items-center'>
                                            <label htmlFor="">Max</label>
                                            <input type="number"
                                                className='outline-none w-[80px] p-2 rounded-xl border border-gray-200'
                                                value={rentRange[1]}
                                                onChange={(e) => setRentRange([rentRange[0], e.target.value])}
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-200 py-4 px-2">
                                <div className="flex justify-start items-center gap-1">
                                    <Scan className="w-4 h-4"/>
                                    <p>Area</p>
                                </div>
                                <div className="space-y-4 mt-2">
                                    <RangeSlider
                                        value={areaRange}
                                        onInput={setAreaRange}
                                        min={0}
                                        max={500}
                                        className='range-slider-custom'
                                    />
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <label htmlFor="">Min</label>
                                            <input type="number"
                                                className='outline-none w-[80px] p-2 rounded-xl border border-gray-200'
                                                value={areaRange[0]}
                                                onChange={(e) => setAreaRange([e.target.value, areaRange[1]])}
                                                />
                                        </div>
                                        <div className='flex flex-col justify-center items-center'>
                                            <label htmlFor="">Max</label>
                                            <input type="number"
                                                className='outline-none w-[80px] p-2 rounded-xl border border-gray-200'
                                                value={areaRange[1]}
                                                onChange={(e) => setAreaRange([areaRange[0], e.target.value])}
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between items-center pt-4 pb-4 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700'>
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
                                        value={searchTerm.bedrooms || 0}
                                        onChange={(e) => setSearchTerm({ ...searchTerm, bedrooms: e.target.value })}
                                        type="number"
                                    />
                                    <Plus 
                                        className='border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 md:p-2 w-7 h-7 md:w-8 md:h-8 
                                            cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-gray-100' 
                                        onClick={() => updateBedrooms(+1)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-center pt-4 pb-6 px-4 md:px-6 gap-2
                                '>
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
                        </div>
                        <div className="w-full flex gap-2 p-2">
                            <button className="basis-1/2 bg-gray-300 hover:bg-gray-400 p-2 rounded-xl cursor-pointer
                                flex justify-center items-center gap-1"
                                onClick={(e) => handleClearFilters()}>
                                <BrushCleaning className="w-4 h-4"/>
                                <p>Clear</p>
                            </button>
                            <button 
                                className="basis-1/2 bg-lime-300 hover:bg-lime-400 p-2 rounded-xl cursor-pointer"
                                onClick={(e) => handleFilter(e)}>
                                Show results
                            </button>
                        </div>
                    </div>
                </div>
            )}

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