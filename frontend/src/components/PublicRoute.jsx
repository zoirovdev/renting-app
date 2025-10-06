import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore.js'

function PublicRoute({ children }) {
    const { currentUser, loading } = useUserStore()
    
    // Wait for auth check to complete
    if (loading) {
        return <div>Loading...</div>
    }
    
    // If already logged in, redirect to home/dashboard
    if (currentUser) {
        return <Navigate to="/" replace />
    }
    
    return children
}

export default PublicRoute