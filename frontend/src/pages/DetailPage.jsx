import { useRentadStore } from '../stores/useRentadStore'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'



const DetailPage = () => {
    const { fetchRentad, currentRentad, loading } = useRentadStore()
    const { id } = useParams()
    const navigate = useNavigate()

    const [imagesModal, setImagesModal] = useState(false) 
    const [currentIndex, setCurrentIndex] = useState(0)

    const goNext = () => {
        if (currentRentad?.images && currentIndex < currentRentad.images.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }
    
    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }



    useEffect(() => {
        setCurrentIndex(0)
        fetchRentad(id)
    }, [fetchRentad, id])

   

    return (
        <div className="flex justify-start items-center p-8">
            <div className={`w-[800px] space-y-8 ${imagesModal ? "hidden" : ""}`}>
                <div className="flex justify-center ml-[120px] w-[700px] h-[400px] relative">
                    <img 
                        src={currentRentad?.images?.[0]|| null} 
                        alt="image" 
                        className='object-cover w-[100%] h-[100%] rounded-[10px]'
                    />
                    <button className='absolute bottom-4 right-4 bg-gray-100 py-1 px-4 
                        cursor-pointer rounded-[5px] z-20'
                        onClick={() => setImagesModal(true)}>
                        Show all pics
                    </button>
                </div>
                <div className="border border-gray-200 rounded-[10px] w-[700px] p-6 ml-[120px]">
                    <p>{currentRentad?.property} in {currentRentad?.location}</p>
                    <p>{currentRentad?.rent} {currentRentad?.rent_currency}s per month</p>
                    <p>Overall area is {currentRentad?.area} {currentRentad?.area_unit}</p>
                    <p>There are {currentRentad?.bedrooms} bedrooms and {currentRentad?.bathrooms} bathrooms</p>
                    <p>Connect ad owner via {currentRentad?.contacts}</p>
                </div>
            </div>

            {imagesModal && 
                <div className='fixed inset-0 z-50 bg-black bg-opacity-90'>
                    <button onClick={() => {setImagesModal(false);}}
                            className='absolute top-4 right-[200px] text-white hover:bg-gray-600 rounded-[10px] py-1 px-4 cursor-pointer'>
                            <X />
                    </button> 
                    <div className="flex items-center justify-evenly mt-[100px]">
                        <ChevronLeft className={`${currentIndex===0 ? "text-black" : "text-white hover:bg-gray-500"}  w-12 h-12 rounded-full p-2`}
                        onClick={() => {goPrev()}}/>
                        <img src={currentRentad.images[currentIndex]} alt="image" className='w-[800px] h-[600px] object-cover transition-transform duration-300'/>
                        <ChevronRight className={`${currentIndex===currentRentad.images.length-1 ? "text-black" : "text-white hover:bg-gray-500"} w-12 h-12 rounded-full p-2`}
                        onClick={() => {goNext()}}/>
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailPage
