import { create } from "zustand"
import axios from "axios"



const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : ""


export const useLocationStore = create((set, get) => ({
    locations: [],
    error: null,
    loading: false,
    currentLocation: null,

    formLocation: {
        lat: "",
        lon: "",
        display_name: "",
        city: "",
        country: "",
        county: "",
        neighbourhood: "",
        postcode: "",
        road: "",
        suburb: ""
    },

    setFormLocation: (formLocation) => set({formLocation}),
    setCurrentLocation: (currentLocation) => set({currentLocation}),

    createLocation: async () => {
        set({ loading: true })

        try {
            const response = await axios.post(`${BASE_URL}/api/locations`, get().formLocation)
            set({ error: null, currentLocation: response.data.data })
            console.log(currentLocation)
            console.log(response.data.data)
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", locations:[] })
            else set({ error: "something went wrong", locations: [] })
        } finally {
            set({ loading: false })
        }
    },


    getLocation: async (id) => {
        set({ loading: true })

        try {
            const response = await axios.get(`${BASE_URL}/api/locations/${id}`)
            set({ error: null, currentLocation: response.data.data })
        } catch (err) {
            if(err.status === 429) set({ error: "Rate limit exceeded", currentLocation: null})
            else set({ error: "Something went wrong", currentLocation: null })
        } finally {
            set({ loading: false })
        }
    }
}))