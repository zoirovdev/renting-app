import { sql } from "../config/db.js"



export const create = async (req, res) => {
    try {
        const { lat, lon, display_name, city, country, county, neighbourhood, postcode, road, suburb } = req.body

        if(!lat || !lon || !display_name ){
            return res.status(400).json({ success:false, message:"All fields are required" })
        }

        const newLocation = await sql`
            INSERT INTO locations (lat, lon, display_name, city, country, county, neighbourhood, postcode, road, suburb)
            VALUES (${lat}, ${lon}, ${display_name}, ${city}, ${country}, ${county}, ${neighbourhood}, ${postcode}, ${road}, ${suburb})
            RETURNING *
        `

        res.status(201).json({ success: true, data: newLocation[0] })
    } catch (error) {
        console.log("Error in create in locationControllers.js", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const get = async (req, res) => {
    try {
        const { id } = req.params

        const location = await sql`SELECT * FROM locations WHERE id=${id}`

        if(!location || location.length === 0){
            return res.status(404).json({ success: false, message: "Location not found" })
        }

        res.status(200).json({ success: true, data: location[0] })
    } catch (error) {
        console.log("Error in get in locationControllers.js", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}