import { useUserStore } from "../stores/useUserStore"
import { useNavigate } from "react-router-dom" 


const LoginPage = () => {
    const { login, loginForm, setLoginForm } = useUserStore()
    // console.log(useUserStore.getState())
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
        <div className="flex justify-center items-center pt-[100px]">
            <div className="w-[600px] shadow-md border border-gray-200 dark:border-gray-700 py-4 px-6 space-y-4 rounded-xl">
              <div className="flex justify-center items-center">
                <p className="text-lg font-semibold tracking-widest dark:text-gray-50">Login</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 dark:text-gray-300">Username</label>
                <input type='text'
                  value={loginForm.username}
                  className="focus:outline-1 focus:outline-lime-500 border border-gray-200 dark:border-gray-700 
                    py-2 px-4 rounded-xl dark:text-gray-50"
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}/>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 dark:text-gray-300">Password</label>
                <input type="password"
                  value={loginForm.password}
                  className="focus:outline-1 focus:outline-lime-500 border border-gray-200 dark:border-gray-700
                  py-2 px-4 rounded-xl dark:text-gray-50" 
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}/>
              </div>
              <div className="flex justify-between items-center">
                <p onClick={(e) => navigate('/signup')}
                  className="text-lime-600 hover:text-lime-500 cursor-pointer">
                  Don't have account? sign up
                </p>
                <button className="bg-lime-400 hover:bg-lime-500 py-2 px-4 rounded-xl cursor-pointer"
                  onClick={handleLogin}>
                  Submit
                </button>
              </div>
            </div>
        </div>
    )
}

export default LoginPage
