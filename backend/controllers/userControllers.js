import { sql } from "../config/db.js"



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
        const { firstname, lastname, phone, username, password } = req.body

        if(!firstname || !lastname || !phone || !username || !password){
            return res.status(400).json({ success:false, message:"All fields are required"})
        }

        const newUser = await sql`
            INSERT INTO users (firstname, lastname, phone, username, password)
            VALUES (${firstname}, ${lastname}, ${phone}, ${username}, ${password})
            RETURNING *
        `

        res.status(200).json({ success:true, data:newUser[0] })
    } catch (error){
        console.log("Error in create", error)
        res.status(500).json({ success:false, message:"Internal Server Error" })
    }
}