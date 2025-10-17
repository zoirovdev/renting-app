import { Routes, Route, useLocation } from "react-router-dom"
import Bar from "./components/Bar.jsx"
import HomePage from "./pages/HomePage.jsx"
import DetailPage from "./pages/DetailPage.jsx"
import AddPage from "./pages/AddPage.jsx"
import SearchPage from "./pages/SearchPage.jsx"
import ProfileEditPage from "./pages/ProfileEditPage.jsx"
import RandomProfilePage from "./pages/RandomProfilePage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import PublicRoute from "./components/PublicRoute.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { ThemeProvider } from "./components/ThemeProvider.jsx"


import 'leaflet/dist/leaflet.css';



function App() {
  const location = useLocation()
  const showBar = location.pathname !== "/login" && location.pathname !== "/signup"

  return (
    <ThemeProvider>
    <div className="dark:bg-gray-900 min-h-screen">
      {showBar && <Bar />}
       
      <div className={showBar ? "mt-[100px]" : ""}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          }/>
          <Route path="/detail/:id" element={
            <ProtectedRoute>
              <DetailPage/>
            </ProtectedRoute>
          }/>
          <Route path="/add" element={
            <ProtectedRoute>
              <AddPage/>
            </ProtectedRoute>
          }/>
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage/>
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileEditPage/>
            </ProtectedRoute>
          }/>
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage/>
            </ProtectedRoute>
          }/>
          <Route path="/random-profile/:id" element={
            <ProtectedRoute>
              <RandomProfilePage/>
            </ProtectedRoute>
          }/>

          {/* Public Routes (redirect to home if logged in) */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage/>
            </PublicRoute>
          }/>
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage/>
            </PublicRoute>
          }/>
        </Routes>
      </div>
    </div>
    </ThemeProvider>
  )
}



export default App