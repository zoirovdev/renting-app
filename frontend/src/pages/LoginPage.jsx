import { useUserStore } from "../stores/useUserStore"
import { useNavigate } from "react-router-dom" 


const LoginPage = () => {
    const { login, loginForm, setLoginForm } = useUserStore()
    const navigate = useNavigate()

    const handleLogin = async () => {
      try {
        await login()
        navigate("/")
      } catch (err) {
        console.log("Error in handleLogin", err)
        return
      }
    }

    return (
        <div className="flex justify-center items-center pt-[100px] px-4 md:px-0 pb-20 md:pb-8">
            <div className="w-full max-w-[600px] shadow-md border border-gray-200 dark:border-gray-700 
                py-6 px-4 md:px-6 space-y-4 rounded-xl">
              <div className="flex justify-center items-center">
                <p className="text-lg md:text-xl font-semibold tracking-widest dark:text-gray-50">Login</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 dark:text-gray-300 text-sm md:text-base mb-1">Username</label>
                <input type='text'
                  value={loginForm.username}
                  placeholder="Enter your username"
                  className="focus:outline-none focus:ring-2 focus:ring-lime-500 border border-gray-200 dark:border-gray-700 
                    py-2 px-4 rounded-xl dark:text-gray-50 text-sm md:text-base"
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}/>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 dark:text-gray-300 text-sm md:text-base mb-1">Password</label>
                <input type="password"
                  value={loginForm.password}
                  placeholder="Enter your password"
                  className="focus:outline-none focus:ring-2 focus:ring-lime-500 border border-gray-200 dark:border-gray-700
                    py-2 px-4 rounded-xl dark:text-gray-50 text-sm md:text-base" 
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}/>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-2">
                <p onClick={(e) => navigate('/signup')}
                  className="text-lime-600 hover:text-lime-500 cursor-pointer text-sm md:text-base text-center md:text-left">
                  Don't have account? sign up
                </p>
                <button className="bg-lime-400 hover:bg-lime-500 py-2 px-4 rounded-xl cursor-pointer 
                    transition-colors text-sm md:text-base font-medium w-full md:w-auto"
                  onClick={handleLogin}>
                  Submit
                </button>
              </div>
            </div>
        </div>
    )
}

export default LoginPage