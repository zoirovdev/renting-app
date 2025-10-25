import React from 'react'
import { useRentadStore } from "../stores/useRentadStore.js"
import { useEffect, useState } from 'react'
import { DollarSign, MapPin, BedDouble, Wallet, Settings, Calendar1 } from "lucide-react"
import { Link } from "react-router-dom"
import Map from "../components/Map.jsx"
import { useLocationStore } from '../stores/useLocationStore.js'


const HomePage = () => {
  const { fetchRentads, rentads, loading, sortByOffers, sortByRents, getWithoutRieltor, getNearby } = useRentadStore()
  const [displayRentads, setDisplayRentads] = useState()
  const [sortOption, setSortOption] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadingRentads = [
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
    { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 },
    { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 },
  ]



  const success = async (position) => {
    const { latitude, longitude } = position.coords;
    const accuracy = position.coords.accuracy
    
    console.log(`Lat: ${latitude}, Lon: ${longitude}, Accuracy: ${accuracy}`)
    await getNearby(latitude, longitude)
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
      setLocationLoading(false);
  }

  const getLocation = () => {
      setLocationLoading(true);
      setError(null);
      
      // Check if geolocation is supported
      if (!navigator.geolocation) {
          setError('Geolocation is not supported by this browser.');
          setLocationLoading(false);
          return;
      }

      const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(success, handleError, options);
  }


  useEffect(() => {
    fetchRentads()
    
  }, [fetchRentads])


  // if(loading) return <div>Loading...</div>

  return (
      <div className='flex flex-col gap-4 relative min-h-screen py-4 md:pb-8 pb-20 dark:bg-gray-900'>
        {/* Sort */}
        <div className="flex sm:flex-wrap justify-center items-center px-4 md:px-0">
          <div className='flex flex-row justify-start md:justify-center items-center gap-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto'>
            <button onClick={() => {sortByOffers('recently renovated'); setSortOption('Recently renovated')}}
              className={`border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 cursor-pointer whitespace-nowrap
                ${sortOption === 'Recently renovated' ? "border-none bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900" 
                : "dark:text-gray-50" }`}>
              Recently renovated
            </button>
            <button onClick={() => {setSortOption('Lowest rents'); sortByRents()}}
              className={`border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 cursor-pointer whitespace-nowrap
                ${sortOption === 'Lowest rents' ? "border-none bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900"
                : "dark:text-gray-50" }`}>
              Lowest rents
            </button>
            <button onClick={() => {setSortOption('Nearby'); getLocation()}}
              className={`border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 cursor-pointer whitespace-nowrap
                ${sortOption === 'Nearby' ? "border-none bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900" 
                : "dark:text-gray-50" }`}>
              Nearby
            </button>
            <button onClick={() => {setSortOption('Without rieltor'); getWithoutRieltor()}}
              className={`border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 cursor-pointer whitespace-nowrap
                ${sortOption === 'Without rieltor' ? "border-none bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900"
                : "dark:text-gray-50" }`}>
              Without rieltor
            </button>
            <button onClick={() => {setSortOption('Lease agreement'); sortByOffers('lease agreement')}}
              className={`border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 cursor-pointer whitespace-nowrap
                ${sortOption === 'Lease agreement' ? "border-none bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900"
                : "dark:text-gray-50" }`}>
              Lease agreement
            </button>
          </div>
        </div>

        {/* Feed */}
        {loading 
        ? <div className='flex flex-wrap justify-center md:justify-start items-center px-4 gap-4 md:px-[110px]'>
            {loadingRentads.map(load => (
              <div key={load.id} 
                className='flex flex-col justify-start w-full sm:w-[calc(50%-0.5rem)] lg:w-[300px] h-[400px] gap-1 pb-4 animate-pulse'>
                {/* Image skeleton */}
                <div className='w-full h-[200px] bg-gray-300 dark:bg-gray-700 rounded-xl'></div>
                
                {/* Content skeleton */}
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
                  
                  {/* Location skeleton */}
                  <div className="flex flex-row justify-start items-center gap-2 w-full">
                    <div className='w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded'></div>
                    <div className='h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded'></div>
                  </div>
                  
                  {/* Offers skeleton */}
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
        ? <div className='flex flex-col justify-center items-center px-4 md:mx-[110px] mt-20'>
            <div className='text-gray-400 dark:text-gray-500 text-center'>
              <p className='text-6xl mb-4'>🏠</p>
              <p className='text-xl font-semibold mb-2'>No properties found</p>
              <p className='text-gray-500 dark:text-gray-400'>Try adjusting your search filters</p>
            </div>
          </div>
        : <div className='flex flex-wrap justify-center md:justify-start items-center px-4 gap-4 md:px-[110px]'>
          {rentads.length && rentads.map((rentad) => (
            <Link to={`/detail/${rentad.id}`} key={rentad.id} 
              className='flex flex-col justify-start w-full sm:w-[calc(50%-0.5rem)] lg:w-[300px] h-[400px] gap-1 pb-4'>
              {rentad.images.length && 
              <div className='w-full'>
                <img src={rentad.images[0]} alt="" className='object-cover w-full h-[200px] rounded-xl'/>  
              </div>}
              <div className='grid grid-cols-1 py-2 px-4 gap-2'>
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <p className='font-semibold tracking-wider dark:text-slate-50'>{rentad.property}</p>
                    <p className='dark:text-slate-50'>{rentad.bedrooms} <span className='text-gray-500 dark:text-slate-300'>{rentad.bedrooms > 1 ? "rooms" : "room"}</span> • {rentad.area} <span className='text-gray-500 dark:text-slate-300'>{rentad.area_unit}</span></p>
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
        </div>}
      </div>
  )
}

export default HomePage