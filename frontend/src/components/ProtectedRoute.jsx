import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore.js'

function ProtectedRoute({ children }) {
    const { currentUser, loading } = useUserStore()
    
    // Wait for auth check to complete
    if (loading) {
        return <div>Loading...</div> // Or your loading spinner
    }
    
    // Auth check complete - redirect if not logged in
    if (!currentUser) {
        return <Navigate to="/login" replace />
    }
    
    return children
}


export default ProtectedRoute