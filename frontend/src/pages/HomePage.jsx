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

  useEffect(() => {
    fetchRentads()
  }, [fetchRentads])


  if(loading) return <div>Loading...</div>

  return (
      <div className='relative dark:bg-slate-900 h-screen'>
        <div className='flex flex-wrap justify-center items-center gap-x-2 gap-y-8 place-content-center'>
          {rentads.length && rentads.map((rentad) => (
            <Link to={`/detail/${rentad.id}`} key={rentad.id} 
              className='flex flex-col justify-start  w-[300px] h-[370px] gap-1'>
              {rentad.images.length && 
              <div className='w-full'>
                <img src={rentad.images[0]} alt="" className='object-cover w-[300px] h-[200px] rounded-sm'/>  
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
                  {rentad.offers && rentad.offers.map(offer => (
                    <p key={offer} className="border border-blue-400 rounded-full px-2 text-sm text-gray-600 dark:text-slate-300">{offer}</p>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
  )
}

export default HomePage