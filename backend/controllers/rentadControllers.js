import { sql } from "../config/db.js"


export const getAll = async (req, res) => {
    try {
        const rentads = await sql`
            SELECT * FROM rentads
            ORDER BY created_at DESC
        `

        res.status(200).json({ success: true, data: rentads })
    } catch (error) {
        console.log("Error get rentads", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const create = async (req, res) => {
    try {
        const { details, price, images, user_id } = req.body
        console.log(req.body)

        if(!details || !price || !images || !user_id){
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        if (typeof details !== 'string' || isNaN(parseFloat(price))) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid data format" 
            })
        }

        const imageArray = Array.isArray(images) ? images : [images]

        const newRentad = await sql`
            INSERT INTO rentads (details, price, images, user_id)
            VALUES (${details}, ${parseFloat(price)}, ${imageArray}, ${parseInt(user_id)})
            RETURNING *
        `
    
        res.status(201).json({ success: true, data: newRentad[0] })
    } catch (error) {
        console.log("Error in create", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}