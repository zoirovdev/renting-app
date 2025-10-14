import { Routes, Route, useLocation } from "react-router-dom"
import Sidebar from "./components/Sidebar.jsx"
import HomePage from "./pages/HomePage.jsx"
import DetailPage from "./pages/DetailPage.jsx"
import AddPage from "./pages/AddPage.jsx"
import SearchPage from "./pages/SearchPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import PublicRoute from "./components/PublicRoute.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { ThemeProvider } from "./components/ThemeProvider.jsx"


import 'leaflet/dist/leaflet.css';



function App() {
  const location = useLocation()
  const showSidebar = location.pathname !== "/login" && location.pathname !== "/signup"

  return (
    <ThemeProvider>
    <div className="dark:bg-[#222831] min-h-screen">
      {showSidebar && <Sidebar />}
       
      <div className={showSidebar ? "mt-[100px]" : ""}>
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
              <ProfilePage/>
            </ProtectedRoute>
          }/>
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage/>
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