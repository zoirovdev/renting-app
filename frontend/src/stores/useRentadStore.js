import { create } from "zustand"
import axios from "axios"




const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : ""


export const useRentadStore = create((set, get) => ({
    rentads: [],
    loading: false,
    error: null,
    currentRentad: null,


    formData: {
        property: "",
        area: 0,
        area_unit: "",
        rent: 0,
        rent_currency: "",
        rent_period: "",
        bedrooms: 0,
        bathrooms: 0,
        location_id: 0,
        location_display: "",
        images: [],
        offers: [],
        user_id: 0,
        user_type: "",
        user_phone: "",
        user_name: ""
    },


    setFormData: (formData) => set({formData}),
    resetFormData: () => set({ formData: { property:"", area:0, area_unit:"", rent:0, rent_currency:"", rent_period:"", 
        bedrooms:0, bathrooms:0, location_id:0, location_display: "", images:[], offers:[], user_id:0, user_type:"", 
        user_phone:"", user_name:""}}),

    
    fetchRentads: async () => {
        set({loading: true})

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads`)
            set({ rentads: response.data.data, err:null })
        } catch (error) {
            if(error.status === 429) set({ err: "Rate limit exceeded", rentads:[] })
            else set({ err: "something went wrong", rentads: [] })
        } finally {
            set({ loading: false })
        }
    },

    fetchRentad: async (id) => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/${id}`)
            set({ currentRentad: response.data.data, err:null })
        } catch (error) {
            if(error.status === 429) set({ err: "Rate limit exceeded", currentRentad: null })
            else set({ err: "Something went wrong", currentRentad: null })
        } finally {
            set({ loading: false })
        }
    },

    createRentad: async (e) => {
        e.preventDefault()
        set({ loading:true })

        try {
            const response = await axios.post(`${BASE_URL}/api/rentads`, get().formData)
            console.log(response)
            await get().fetchRentads()
            get().resetFormData()
        } catch (err){
            console.log("Error in createRentad func", err)
        } finally {
            set({ loading:false })
        }
    },

    searchRentad: async (params) => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/search?${params.toString()}`)
            set({ rentads: response.data.data })
        } catch (err) {
            console.log("Error in createRentad func", err)
        } finally {
            set({ loading:false })
        }
    }
}))