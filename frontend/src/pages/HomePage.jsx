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
      <div className='p-8 relative'>
        <div className='flex flex-wrap justify-start items-center gap-2 place-content-center mt-8'>
          {rentads.length && rentads.map((rentad) => (
            <Link to={`/detail/${rentad.id}`} key={rentad.id} 
              className='flex flex-col justify-start  w-[300px] h-[370px] gap-1'>
              {rentad.images.length && 
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
                {/* <div className='flex flex-row justify-end items-center gap-2'>
                  <p className='text-sm'>{Math.floor((new Date() - new Date(rentad.created_at)) / (1000 * 60 * 60 * 24))===0 ? 'Today' : 
                    Math.floor((new Date() - new Date(rentad.created_at)) / (1000 * 60 * 60 * 24))===1 ? 'Yesterday' : 
                    `${Math.floor((new Date() - new Date(rentad.created_at)) / (1000 * 60 * 60 * 24))} days ago` }</p>
                </div> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
  )
}

export default HomePage