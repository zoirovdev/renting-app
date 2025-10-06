import React from 'react'
import { useRentadStore } from "../stores/useRentadStore.js"
import { useEffect, useState } from 'react'
import { DollarSign, MapPin, BedDouble, Wallet, Settings } from "lucide-react"
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
        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-center gap-1 mt-8'>
          {rentads.length && rentads.map((rentad) => (
            <Link to={`/detail/${rentad.id}`} key={rentad.id} className='flex flex-col justify-start  w-[370px] h-[370px]'>
              {rentad.images.length && 
              <div className='w-full'>
                <img src={rentad.images[0]} alt="" className='object-cover w-[365px] h-[200px]'/>  
              </div>}
              <ul className='ml-4 mt-2 mb-4 space-y-2 font-serif'>
                <li className='flex gap-2'>
                  <p className='flex justify-center items-center'><MapPin className='w-4 h-4'/></p>
                  <p>{rentad.property} in {rentad.location_display}</p>            
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
          ))}
        </div>
      </div>
  )
}

export default HomePage