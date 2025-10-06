import express from "express"
import { 
    create,
    getAll, 
    signup, 
    login, 
    getProfile, 
    updateUser,
    changePassword,
    deleteUser,
} from "../controllers/userControllers.js"
import jwt from 'jsonwebtoken'


const router = express.Router()


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' })
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key-change-in-production'

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' })
        }
        req.user = user
        next()
    })
}





// Public routes (no authentication required)
router.post('/signup', signup)
router.post('/login', login)

// Protected routes (authentication required)
router.get('/profile/:id', authenticateToken, getProfile)
router.put('/update', authenticateToken, updateUser)
router.put('/change-password', authenticateToken, changePassword)
router.delete('/delete', authenticateToken, deleteUser)


// Admin routes (you may want to add role checking)
router.get('/', authenticateToken, getAll)
router.post('/', authenticateToken, create)


export default router