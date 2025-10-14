import React from 'react'
import { useRentadStore } from "../stores/useRentadStore.js"
import { useEffect, useState } from 'react'
import { DollarSign, MapPin, BedDouble, Wallet, Settings, Calendar1 } from "lucide-react"
import { Link } from "react-router-dom"
import Map from "../components/Map.jsx"
import { useLocationStore } from '../stores/useLocationStore.js'


const HomePage = () => {
  const { fetchRentads, rentads, loading } = useRentadStore()
  const { getLocation, currentLocation } = useLocationStore()
  const [displayRentads, setDisplayRentads] = useState()

  const [sortOptions, setSortOptions] = useState([
    { id: 1, name: "New", state: false },
    { id: 2, name: "Recently renovated", state: false },
    { id: 3, name: "Lowest rents", state: false },
    { id: 4, name: "Nearby", state: false },
    { id: 5, name: "Without rieltor", state: false },
    { id: 6, name: "Lease agreement", state: false } 
  ])

  const handleSort = async (id) => {
    setSortOptions(prevOptions => prevOptions.map(option => ({
      ...option,
      state: option.id === id
    })))
  }

  useEffect(() => {
    fetchRentads()
  }, [fetchRentads])


  if(loading) return <div>Loading...</div>

  return (
      <div className='flex flex-col gap-4 relative dark:bg-slate-900 h-screen py-8'>
        <div className="flex justify-center items-center">
          <div className='flex flex-row justify-center items-center gap-1'>
            {sortOptions.map(option => (
              <p key={option.id}
                className={`border border-gray-200 py-2 px-4 rounded-xl cursor-pointer
                ${option.state ? "border-none bg-gray-900 text-gray-50" : ""}`}
                onClick={() => handleSort(option.id)}>
                {option.name}
              </p>
            ))}
          </div>
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
  )
}

export default HomePage