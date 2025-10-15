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
        <div className="flex justify-center items-center pt-[100px]">
            <div className="w-[600px] shadow-md border border-gray-100 dark:border-gray-700 
                rounded-xl py-4 px-6 space-y-4 ">
                <div className="flex justify-center items-center">
                    <p className="text-lg font-semibold tracking-widest dark:text-gray-50">Sign up</p>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="username" className="text-gray-500 dark:text-gray-300">Username</label>
                    <input type="text"
                        className="focus:outline-1 focus:outline-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50"
                        id="username" name="username"
                        onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="firstname" className="text-gray-500 dark:text-gray-300">Firstname</label>
                    <input type="text"
                        id="firstname" name="lastname"
                        className="focus:outline-1 focus:outline-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50"
                        onChange={(e) => setSignupForm({ ...signupForm, firstname: e.target.value })}/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastname" className="text-gray-500 dark:text-gray-300">Lastname</label>
                    <input type="text"
                        id="lastname" name="lastname"
                        className="focus:outline-1 focus:outline-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50"
                        onChange={(e) => setSignupForm({ ...signupForm, lastname: e.target.value })}/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="phone" className="text-gray-500 dark:text-gray-300">Phone</label>
                    <input type="text"
                        id="phone" name="phone"
                        className="focus:outline-1 focus:outline-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50"
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="text-gray-500 dark:text-gray-300">Password</label>
                    <input type="password" 
                        id="password" name="password"
                        className="focus:outline-1 focus:outline-lime-500 border border-gray-200 dark:border-gray-700
                        py-2 px-4 rounded-xl dark:text-gray-50"
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}/> 
                </div>
                <div className="flex justify-between items-center">
                    <p onClick={(e) => navigate('/signup')}
                        className="text-lime-600 hover:text-lime-500 cursor-pointer">
                        have account? log in
                    </p>
                    <button 
                        className="bg-lime-400 hover:bg-lime-500 cursor-pointer py-2 px-4 rounded-xl"
                        onClick={handleSignup}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
