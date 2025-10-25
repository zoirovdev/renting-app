import { create } from "zustand"
import axios from "axios"




const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : ""


export const useRentadStore = create((set, get) => ({
    rentads: [],
    rentadsWithLocations: [],
    loading: false,
    error: null,
    currentRentad: null,


    formData: {
        property: "",
        area: 0,
        area_unit: "sqm",
        rent: 0,
        rent_currency: "$",
        rent_period: "",
        bedrooms: 0,
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
    resetFormData: () => set({ formData: { property:"", area:0, area_unit:"sqm", rent:0, rent_currency:"$", rent_period:"", 
        bedrooms:0, location_id:0, location_display: "", images:[], offers:[], user_id:0, user_type:"", 
        user_phone:"", user_name:""}}),

    
    fetchRentads: async () => {
        set({loading: true})

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads`)
            set({ rentads: response.data.data, err:null })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally {
            set({ loading: false })
        }
    },

    fetchRentad: async (id) => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/${id}`)
            set({ currentRentad: response.data.data, err:null })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", currentRentad: null })
            else set({ error: "Something went wrong", currentRentad: null })
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
            console.log("Error in searchRentad func", err)
        } finally {
            set({ loading:false })
        }
    },

    getRentadWithLocs: async () => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/getWithLocations`)
            set({ rentadsWithLocations: response.data.data, err:null })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentadsWithLocations:[] })
            else set({ error: "something went wrong", rentadsWithLocations: [] })
        } finally {
            set({ loading:false })
        }
    },

    getByUserId: async (userId) => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/user/${userId}`)
            set({ error: null, rentads: response.data.data })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally {
            set({ loading: false })
        }
    },

    sortByOffers: async (filter) => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/sort-by-offers/${filter}`)
            set({ error: null, rentads: response.data.data })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally {
            set({ loading: false })
        }
    },

    sortByRents: async () => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/sort-by-lowest-rents`)
            set({ error:null, rentads: response.data.data })
        } catch(err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally {
            set({ loading: false })
        }
    },

    getWithoutRieltor: async () => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/get-without-rieltor`)
            set({ error: null, rentads: response.data.data })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally { 
            set({ loading: false })
        }
    },

    getNearby: async (lat, lon) => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/rentads/get-nearby?user_lat=${lat}&user_lon=${lon}`)
            set({ error: null, rentads: response.data.data })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally {
            set({ loading: false })
        }
    },

    deleteById: async (id) => {
        set({ loading: true })

        try {
            const response = await axios.delete(`${BASE_URL}/api/rentads/${id}`)
            set({ error: null, currentRentad: response.data.data })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally { 
            set({ loading: false })
        }
    },

    updateById: async (id) => {
        set({ loading: true })

        try {
            const response = await axios.put(`${BASE_URL}/api/rentads/${id}`, get().formData)
            set({ error: null, currentRentad: response.data.data })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", rentads:[] })
            else set({ error: "something went wrong", rentads: [] })
        } finally {
            set({ loading: false })
        }
    }
}))