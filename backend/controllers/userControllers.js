import { sql } from "../config/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key-change-in-production'
const SALT_ROUNDS = 10




export const getAll = async (req, res) => {
    try {
        const users = await sql`
            SELECT * FROM users
            ORDER BY created_at DESC
        `

        res.status(200).json({ success:true, data:users })
    } catch (error){
        console.log("Error in getAll", error)
        res.status(500).json({ success:false, message:"Internal Server Error" })
    }
}


export const create = async (req, res) => {
    try {
        const { firstname, lastname, phone, username, password, location } = req.body

        if(!firstname || !lastname || !phone || !username || !password || !location){
            return res.status(400).json({ success:false, message:"All fields are required"})
        }

        const newUser = await sql`
            INSERT INTO users (firstname, lastname, phone, username, password, location)
            VALUES (${firstname}, ${lastname}, ${phone}, ${username}, ${password}, ${location})
            RETURNING *
        `

        res.status(200).json({ success:true, data:newUser[0] })
    } catch (error){
        console.log("Error in create", error)
        res.status(500).json({ success:false, message:"Internal Server Error" })
    }
}



export const signup = async (req, res) => {
    try {
        const { username, firstname, lastname, phone, password} = req.body

        // Validation
        if (!username || !password || !firstname || !lastname || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        if (password.length < 4) {
            return res.status(400).json({ success: false, message: 'Password must be at least 4 characters' })
        }

        // Check if user already exists
        const existingUser = await sql`
            SELECT id FROM users 
            WHERE username = ${username} OR phone = ${phone}
        `

        if (existingUser.length > 0) {
            return res.status(409).json({ success: false, message: 'Username or phone number already registered' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        // Create user
        const newUser = await sql`
            INSERT INTO users (username, firstname, lastname, phone, password)
            VALUES (${username}, ${firstname}, ${lastname}, ${phone}, ${hashedPassword})
            RETURNING *
        `

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: newUser[0].id, 
                username: newUser[0].username 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: newUser[0]
        })
    } catch (error) {
        console.error('Signup error:', error)
        
        // Handle unique constraint violations
        if (error.code === '23505') {
            if (error.constraint === 'users_username_key') {
                return res.status(409).json({ success: false, message: "Username already exists" })
            }
            if (error.constraint === 'users_phone_key') {
                return res.status(409).json({ success: false, message: "Phone number already exists" })
            }
        }
        
        res.status(500).json({ success: false, message: 'Server error during signup' })
    }
}



export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        // Validation
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' })
        }

        // Find user
        const users = await sql`
            SELECT * FROM users 
            WHERE username = ${username}
        `

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' })
        }

        const user = users[0]

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' })
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: user
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ success: false, message: 'Server error during login' })
    }
}



export const getProfile = async (req, res) => {
    try {
        const { id } = req.params
        // req.user is set by authenticateToken middleware
        const users = await sql`
            SELECT id, username, firstname, lastname, phone, created_at, updated_at
            FROM users 
            WHERE id = ${id}
        `

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.json({
            success: true,
            data: users[0]
        })
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}


// Update User (Protected Route)
export const updateUser = async (req, res) => {
    try {
        const { firstname, lastname, phone, location } = req.body
        const userId = req.user.id

        // Build dynamic update query
        const updates = []
        const values = []
        
        if (firstname) {
            updates.push(`firstname = $${updates.length + 1}`)
            values.push(firstname)
        }
        if (lastname) {
            updates.push(`lastname = $${updates.length + 1}`)
            values.push(lastname)
        }
        if (phone) {
            updates.push(`phone = $${updates.length + 1}`)
            values.push(phone)
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' })
        }

        updates.push('updated_at = CURRENT_TIMESTAMP')
        values.push(userId)

        const updatedUser = await sql`
            UPDATE users 
            SET ${sql(updates.join(', '))}
            WHERE id = ${userId}
            RETURNING id, username, firstname, lastname, phone, updated_at
        `

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser[0]
        })
    } catch (error) {
        console.error('Update user error:', error)
        
        if (error.code === '23505' && error.constraint === 'users_phone_key') {
            return res.status(409).json({ success: false, message: "Phone number already exists" })
        }
        
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// Change Password (Protected Route)
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user.id

        console.log(req.body)

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current and new password are required' })
        }

        if (newPassword.length < 4) {
            return res.status(400).json({ success: false, message: 'New password must be at least 4 characters' })
        }

        // Get current password
        const users = await sql`
            SELECT password FROM users WHERE id = ${userId}
        `

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

        // Update password
        await sql`
            UPDATE users 
            SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
        `

        res.json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch (error) {
        console.error('Change password error:', error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// Delete User (Protected Route)
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id

        await sql`
            DELETE FROM users WHERE id = ${userId}
        `

        res.json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.error('Delete user error:', error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}