import { useUserStore } from "../stores/useUserStore.js"
import { useNavigate } from "react-router-dom"


const SignupPage = () => {
    const { signup, signupForm, setSignupForm } = useUserStore()
    const navigate = useNavigate()

    const handleSignup = async () => {
        try {
            await signup()
            navigate("/")
        } catch (err) {
            console.log("Error in signup", err)
            return
        }
    }

    return (
        <div className="flex justify-center items-center pt-[100px] px-4 md:px-0 pb-20 md:pb-8">
            <div className="w-full max-w-[600px] shadow-md border border-gray-100 dark:border-gray-700 
                rounded-xl py-6 px-4 md:px-6 space-y-4">
                <div className="flex justify-center items-center">
                    <p className="text-lg md:text-xl font-semibold tracking-widest dark:text-gray-50">Sign up</p>
                </div>
                <p className="flex justify-center items-center text-gray-500 dark:text-gray-400">You can enter any phone number it is considered valid. </p>
                <p className="flex justify-center items-center text-gray-500 dark:text-gray-400">And we don't send SMS to you</p>
                <div className="flex flex-col">
                    <label htmlFor="username" className="text-gray-500 dark:text-gray-300 text-sm md:text-base mb-1">Username</label>
                    <input type="text"
                        className="focus:outline-none focus:ring-2 focus:ring-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50 text-sm md:text-base"
                        id="username" name="username"
                        placeholder="Choose a username"
                        onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}/>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <div className="flex flex-col w-full md:basis-1/2">
                        <label htmlFor="firstname" className="text-gray-500 dark:text-gray-300 text-sm md:text-base mb-1">Firstname</label>
                        <input type="text"
                            id="firstname" name="firstname"
                            className="focus:outline-none focus:ring-2 focus:ring-lime-500 border border-gray-200 dark:border-gray-700
                            py-2 px-4 rounded-xl dark:text-gray-50 text-sm md:text-base"
                            placeholder="Your first name"
                            onChange={(e) => setSignupForm({ ...signupForm, firstname: e.target.value })}/>
                    </div>
                    <div className="flex flex-col w-full md:basis-1/2">
                        <label htmlFor="lastname" className="text-gray-500 dark:text-gray-300 text-sm md:text-base mb-1">Lastname</label>
                        <input type="text"
                            id="lastname" name="lastname"
                            className="focus:outline-none focus:ring-2 focus:ring-lime-500 border border-gray-200 dark:border-gray-700
                            py-2 px-4 rounded-xl dark:text-gray-50 text-sm md:text-base"
                            placeholder="Your last name"
                            onChange={(e) => setSignupForm({ ...signupForm, lastname: e.target.value })}/>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="phone" className="text-gray-500 dark:text-gray-300 text-sm md:text-base mb-1">Phone</label>
                    <input type="text"
                        id="phone" name="phone"
                        className="focus:outline-none focus:ring-2 focus:ring-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50 text-sm md:text-base"
                        placeholder="+998 90 123 45 67"
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="text-gray-500 dark:text-gray-300 text-sm md:text-base mb-1">Password</label>
                    <input type="password" 
                        id="password" name="password"
                        className="focus:outline-none focus:ring-2 focus:ring-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50 text-sm md:text-base"
                        placeholder="Create a password"
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}/> 
                </div>
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-2">
                    <p onClick={(e) => navigate('/login')}
                        className="text-lime-600 hover:text-lime-500 cursor-pointer text-sm md:text-base text-center md:text-left">
                        Have account? log in
                    </p>
                    <button 
                        className="bg-lime-400 hover:bg-lime-500 cursor-pointer py-2 px-4 rounded-xl 
                        transition-colors text-sm md:text-base font-medium w-full md:w-auto"
                        onClick={handleSignup}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
