import { create } from "zustand"
import axios from "axios"



const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : ""


export const useUserStore = create((set, get) => ({
    currentUserloading: true,
    randomUserLoading: true,
    error: null,
    currentUser: null,
    randomUser: null,

    signupForm: {
        firstname: "",
        lastname: "",
        phone: "",
        password: ""
    },


    setSignupForm: (signupForm) => set({ signupForm }),
    resetSignupForm: () => set({ signupForm: { firstname:"", lastname:"", phone:"", password:"" }}),

    loginForm: {
        phone: "",
        password: ""
    },

    setLoginForm: (loginForm) => set({ loginForm }),
    resetLoginForm: () => set({ loginForm: { phone: "", password: "" } }),

    initializeAuth: async () => {
        // console.log("🔍 initializeAuth STARTED")
        
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")
        
        // console.log("Token exists:", !!token)
        // console.log("UserId:", userId)

        if (token && userId) {
            console.log("🚀 Attempting to fetch user...")
            try {
                const userIdNum = parseInt(userId)
                if (isNaN(userIdNum)) {
                    console.log("❌ Invalid userId")
                    throw new Error("Invalid user ID")
                }

                const url = `${BASE_URL}/api/users/profile/${userIdNum}`
                // console.log("📡 Fetching from:", url)
                // console.log("🔑 With token:", token.substring(0, 20) + "...")
                
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                // console.log("✅ API Response received:", response.data)
                // console.log("✅ User data:", response.data.data)
                
                set({ error: null, currentUser: response.data.data, loading: false })
                // console.log("✅ Store updated with currentUser")
                // console.log("Final store state:", useUserStore.getState())
            } catch (err) {
                // console.error("❌ FULL ERROR:", err)
                // console.error("❌ Response status:", err.response?.status)
                // console.error("❌ Response data:", err.response?.data)
                // console.error("❌ Error message:", err.message)
                
                localStorage.removeItem("token")
                localStorage.removeItem("userId")
                set({ currentUser: null, currentUserloading: false, error: null })
            }
        } else {
            // console.log("⚠️ No token or userId found in localStorage")
            set({ currentUserloading: false })
        }
        
        // console.log("🔍 initializeAuth COMPLETED")
    },

    signup: async () => {
        set({ currentUserloading: true })

        try {
            const response = await axios.post(`${BASE_URL}/api/users/signup`, get().signupForm)
            set({ error: null, currentUser: response.data.user })
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("userId", response.data.user.id)
            get().resetSignupForm()

            return { success: true, message: "Successfully!" }
        } catch (err) {
            if(err.status === 429) {
                set({ error: "Rate limit exceeded", currentUser: null }) 
                return { success: false, message: "Error" }
            } else if (err.status === 401) {
                set({ error: "Phone number is not valid", currentUser: null })
                return { success: false, message: "Error" }
            } else if (err.status === 409){
                set({ error: "Phone number already registered", currentUser: null })
                return { success: false, message: "Error" }
            } else {
                set({ error: "Something went wrong", currentUser: null })
                return { success: false, message: "Error" }
            }
        } finally {
            set({ currentUserloading: false })
        }
    },

    login: async (e) => {
        set({ currentUserloading: true })
        e.preventDefault()

        try {
            const response = await axios.post(`${BASE_URL}/api/users/login`, get().loginForm)
            set({ error: null, currentUser: response.data.user })
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("userId", response.data.user.id)
            get().resetLoginForm()
        } catch (err) {
            if(err.status === 429) {
                set({ error: "Rate limit exceeded", currentUser: null }) 
            } else if (err.status === 401) {
                set({ error: "Invalid credentials", currentUser: null })
            } else {
                set({ error: "Something went wrong", currentUser: null })
            }
        } finally {
            set({ currentUserloading: false })
        }
    },

    getUser: async () => {
        set({ currentUserloading: true })

        try {
            const userId = parseInt(localStorage.getItem("userId"))
            const token = localStorage.getItem("token")

            const response = await axios.get(`${BASE_URL}/api/users/profile/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            set({ error: null, currentUser: response.data.data.user })
        } catch (err){
            if(err.status === 429) {
                 set({ error: "Rate limit exceeded", currentUser: null }) 
            } else if (err.status === 401) {
                set({ error: "Invalid credentials", currentUser: null })
            } else {
                set({ error: "Something went wrong", currentUser: null })
            }
        } finally {
            set({ currentUserloading: false })
        }
    },

    getRandomUser: async (id) => {
        set({ randomUserLoading: true })

        try {
            const token = localStorage.getItem("token")

            const response = await axios.get(`${BASE_URL}/api/users/profile/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log(response.data.data.user)
            set({ error: null, randomUser: response.data.data })
        } catch (err) {
            if(err.status === 429) {
                 set({ error: "Rate limit exceeded", randomUser: null }) 
            } else if (err.status === 401) {
                set({ error: "Invalid credentials", randomUser: null })
            } else {
                set({ error: "Something went wrong", randomUser: null })
            }
        } finally {
            set({ randomUserLoading: false })
        }
    },

    logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        set({ currentUser: null, error: null })
    },

    changePassword: async (currentPassword, newPassword) => {
        set({ loading: true })

        try {
            const token = localStorage.getItem('token')
            const response = await axios.put(`${BASE_URL}/api/users/change-password`,{
                currentPassword: currentPassword, 
                newPassword: newPassword
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        } catch (err) {
            if(err.status === 429) {
                set({ error: "Rate limit exceeded", currentUser: null }) 
            } else if (err.status === 401) {
                set({ error: "Invalid credentials", currentUser: null })
            } else {
                set({ error: "Something went wrong", currentUser: null })
            }
        } finally {
            set({ loading: false })
        }
    },

    updateProfile: async (firstname, lastname, username) => {
        set({ loading: true })

        try {
            const token = localStorage.getItem('token')

            const response = await axios.put(`${BASE_URL}/api/users/update`, {
                firstname: firstname,
                lastname: lastname,
                username: username                
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if(response.data.success){
                set({ currentUser: response.data.data, error: null })
            } else {
                set({ error: response.data.message })
            }
        } catch (err) {
            if(err.status === 429) {
                set({ error: "Rate limit exceeded", currentUser: null }) 
            } else if (err.status === 401) {
                set({ error: "Invalid credentials", currentUser: null })
            } else {
                set({ error: "Something went wrong", currentUser: null })
            }
        } finally {
            set({ loading: false })
        }
    }
}))


useUserStore.getState().initializeAuth()