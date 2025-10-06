import { useState } from 'react'
import { useRentadStore } from '../stores/useRentadStore.js'
import { Search } from 'lucide-react'
import Map from "../components/Map.jsx"
import { Link } from "react-router-dom"
import { MapPin, Wallet, DollarSign, BedDouble } from "lucide-react"

const SearchPage = () => {
    const { searchRentad, rentads } = useRentadStore()
    const [searchTerm, setSearchTerm] = useState({})
    const propertyOptions = ['', 'Apartment', 'House']
    
    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            const params = new URLSearchParams()
            let count = 0
            searchTerm.property ? params.append('property', searchTerm.property) : count+=1
            searchTerm.location ? params.append('location', searchTerm.location) : count+=1
            searchTerm.minRent ? params.append('minRent', searchTerm.minRent) : count+=1
            searchTerm.maxRent ? params.append('maxRent', searchTerm.maxRent) : count+=1
            searchTerm.rent_period ? params.append('rent_period', searchTerm.rent_period) : count+=1
            searchTerm.bedrooms ? params.append('bedrooms', searchTerm.bedrooms) : count+=1

            if(count===6) return

            await searchRentad(params)
        } catch (err) {
            console.log("Error ", err)
        }
    }

    console.log(rentads)
    
    return (
        <div className='mt-[80px] ml-[100px] mr-[100px] space-y-8'>
            <div className='border border-gray-200 rounded-[10px] flex justify-center items-center'>
                <select value={searchTerm.property || ""}
                    className='outline-none border-r border-gray-200 py-2 px-4'
                    onChange={(e) => setSearchTerm({ ...searchTerm, property: e.target.value })}>
                    <option value="" disabled>Select Property</option>
                    {propertyOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <input type="text"
                    className='outline-none border-r border-gray-200 py-2 px-4'
                    placeholder='Location'
                    onChange={(e) => setSearchTerm({ ...searchTerm, location: e.target.value })}/>
                <input type="number"
                    className='outline-none border-r border-gray-200 py-2 px-4 w-full'
                    placeholder='Min rent'
                    onChange={(e) => setSearchTerm({ ...searchTerm, minRent: e.target.value })}/>
                <input type='number'
                    className='outline-none py-2 px-4 border-r border-gray-200 w-full'
                    placeholder='Max rent'
                    onChange={(e) => setSearchTerm({ ...searchTerm, maxRent: e.target.value })}/>
                <input type="text"
                    className='outline-none py-2 px-4 border-r border-gray-200 w-full'
                    placeholder='Rent period'
                    onChange={(e) => setSearchTerm({ ...searchTerm, rent_period: e.target.value })}/>
                <input type="number"
                    className='outline-none py-2 px-4 border-r border-gray-200 w-full'
                    placeholder='Bedrooms'
                    onChange={(e) => setSearchTerm({ ...searchTerm, bedrooms: e.target.value })}/>
                <button 
                    className='bg-lime-400 py-2 px-6 rounded-r-[10px] cursor-pointer hover:bg-orange-700 transition-colors whitespace-nowrap' 
                    onClick={(e) => handleSearch(e)}>
                    Search
                </button>
            </div>

            <Map />
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {rentads && rentads.length > 0 ? (
                    rentads.map(rentad => (
                        <Link to={`/detail/${rentad.id}`} key={rentad.id} className='flex flex-col justify-start  w-[330px] h-[370px]'>
                            {rentad.images.length && 
                            <div className='w-full'>
                                <img src={rentad.images[0]} alt="" className='object-cover w-[320px] h-[200px]'/>  
                            </div>}
                            <ul className='ml-4 mt-2 mb-4 space-y-2 font-serif'>
                                <li className='flex gap-2'>
                                <p className='flex justify-center items-center'><MapPin className='w-4 h-4'/></p>
                                <p>{rentad.property} in {rentad.location}</p>            
                                </li>  
                                <li className='flex gap-2'>
                                <p className='flex justify-center items-center'><Wallet className="w-4 h-4"/></p>
                                <p className='flex justify-center items-center'>{rentad.rent} <DollarSign className='w-4 h-4'/> per month</p>
                                </li>
                                <li className='flex gap-2'>
                                <p className='flex justify-center items-center'><BedDouble className='w-4 h-4'/></p>
                                <p>has {rentad.bedrooms} rooms</p>
                                </li>
                            </ul>
                        </Link>
                    ))
                ) : (
                    <p className='col-span-3 text-center text-gray-500'>No results found</p>
                )}
            </div>
        </div>
    )
}

export default SearchPage