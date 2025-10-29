import { sql } from "../config/db.js"


export const getAll = async (req, res) => {
    try {
        const rentads = await sql`
            SELECT rentads.*, locations.lat AS latitude, locations.lon AS longitude FROM rentads INNER JOIN locations ON rentads.location_id = locations.id ORDER BY rentads.created_at DESC
        `

        res.status(200).json({ success: true, data: rentads })
    } catch (err) {
        console.log("Error get rentads", err)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const create = async (req, res) => {
    try {
        const { property, area, area_unit, rent, rent_currency, rent_period, bedrooms, 
            location_id, location_display, images, offers, user_id, user_type, user_phone, user_name } = req.body
        console.log(req.body)

        if(!property || !rent || !rent_currency || !rent_period || !bedrooms || !location_id || !location_display 
        || !images || !user_id || !user_type || !user_name || !user_phone || !offers){
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const imageArray = Array.isArray(images) ? images : [images]
        const offerArray = Array.isArray(offers) ? offers : [offers]

        const newRentad = await sql`
            INSERT INTO rentads (property, area, area_unit, rent, rent_currency, rent_period, bedrooms, location_id, location_display, images, offers, user_id, user_type, user_phone, user_name)
            VALUES (${property}, ${area}, ${area_unit}, ${rent}, ${rent_currency}, ${rent_period}, ${bedrooms}, ${location_id}, ${location_display}, ${imageArray}, ${offerArray}, 
            ${parseInt(user_id)}, ${user_type}, ${user_phone}, ${user_name})
            RETURNING *
        `
    
        res.status(201).json({ success: true, data: newRentad[0] })
    } catch (err) {
        console.log("Error in create", err)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const getRentad = async (req, res) => {
    try {
        const { id } = req.params

        const rentad = await sql`
            SELECT * FROM rentads WHERE id=${id}
        `
        if(!rentad || rentad.length === 0){
            return res.status(404).json({ success: false, message: "Rentad not found" })
        }

        res.status(200).json({ success: true, data: rentad[0] })
    } catch (err) {
        console.log("Error in getRentad function", err)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


import multer from 'multer'
import imagekit from '../lib/imagekit.js' 

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10mb 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only images are allowed'))
        }
    }
})

export const uploadImage = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        console.log(1)
        if (err) {
            console.error('Multer error:', err)
            return res.status(400).json({ error: err.message })
        }

        console.log(req.file)
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }
        console.log(2)

        try {
            const result = await imagekit.upload({
                file: req.file.buffer,
                fileName: `rental_${Date.now()}_${req.file.originalname}`,
                folder: '/rentals',
                useUniqueFileName: true,
                transformation: {
                    pre: 'l-text,i-Watermark,fs-50,l-end',
                    post: [
                        {
                            type: 'transformation',
                            value: 'w-800,h-600,c-at_max,q-80'
                        }
                    ]
                }
            })

            console.log('ImageKit upload success:', result)

            res.status(200).json({
                success: true,
                imageUrl: result.url,
                fileId: result.fileId,
                filePath: result.filePath
            })

        } catch (error) {
            console.error('ImageKit upload error:', error)
            res.status(500).json({ 
                error: 'Failed to upload image',
                details: error.message 
            })
        }
    })
}


export const getAllByUserId = async (req, res) => {
    try {
        const { id } = req.params

        const result = await sql`
            SELECT * FROM rentads WHERE user_id=${id} ORDER BY created_at DESC
        `

        res.status(200).json({ success: true, data: result })
    } catch (err) {
        console.log("Error in getAllByUserId function in rentadsController", err)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}


export const sortByOffers = async (req, res) => {
    try {
        const { filter }  = req.params
        const result = await sql`
            SELECT * FROM rentads WHERE ${filter} = ANY(offers) ORDER BY created_at DESC
        `

        res.status(200).json({ success: true, data: result })
    } catch (err) {
        console.log("Error in sortedByRecentlyRenovated function in rentadsController", err)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}


export const sortByLowestRent = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM rentads ORDER BY rent ASC
        `

        res.status(200).json({ success: true, data: result })
    } catch (err) {
        console.log("Error in sortedByLowestRent function in rentadsController", err)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}


export const getWithoutRieltor = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM rentads WHERE user_type != 'Rieltor' ORDER BY created_at DESC
        `

        res.status(200).json({ success: true, data: result })
    } catch (err) {
        console.log("Error in getWithoutRieltor function in rentadsController", err)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}


export const getNearby = async (req, res) => {
    try {
        const { user_lat, user_lon } = req.query
        if(!user_lat || !user_lon){
            return res.status(400).json({ success:false, message: "User latitude and longitude are required!" })
        }

        const userLat = parseFloat(user_lat)
        const userLon = parseFloat(user_lon)

        const distance_km = 5

        const result = await sql`
            SELECT rentads.*, 
                   locations.lat AS latitude, 
                   locations.lon AS longitude,
                   (
                     6371 * acos(
                       cos(radians(${userLat})) * cos(radians(locations.lat)) * 
                       cos(radians(locations.lon) - radians(${userLon})) + 
                       sin(radians(${userLat})) * sin(radians(locations.lat))
                     )
                   ) AS distance_km
            FROM rentads
            INNER JOIN locations ON rentads.location_id = locations.id
            WHERE 
                locations.lat BETWEEN ${userLat - 0.045} AND ${userLat + 0.045}
                AND locations.lon BETWEEN ${userLon - 0.045} AND ${userLon + 0.045}
                AND (
                  6371 * acos(
                    cos(radians(${userLat})) * cos(radians(locations.lat)) * 
                    cos(radians(locations.lon) - radians(${userLon})) + 
                    sin(radians(${userLat})) * sin(radians(locations.lat))
                  )
                ) < ${distance_km}
            ORDER BY distance_km ASC
        `

        res.status(200).json({ success: true, data: result })
    } catch (err) {
        console.log("Error in getNearby function in rentadsController", err)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}


export const deleteById = async (req, res) => {
    try {
        const { id } = req.params

        const result = await sql`
            DELETE FROM rentads WHERE id = ${id} RETURNING *
        `
        if(!result || result.length === 0){
            return res.status(404).json({ success: false, message: "Rentad not found" })
        }

        res.status(200).json({ success: true, data: result[0], message: "deleted successfully" })
    } catch (err) {
        console.log("Error in deleteById function in rentadsController", err)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}


export const update = async (req, res) => {
    try {
        const { id } = req.params
        const { area, area_unit, rent, rent_currency, rent_period, bedrooms, 
            images, offers } = req.body

        if(!area || !area_unit || !rent || !rent_currency || !rent_period || !bedrooms || !images || !offers){
            return res.status(400).json({ success: false, message: "Fields are required to update rentad" })
        }

        const imageArray = Array.isArray(images) ? images : [images]
        const offerArray = Array.isArray(offers) ? offers : [offers]

        const result = await sql`
            UPDATE rentads SET area = ${area}, area_unit = ${area_unit}, rent = ${rent}, rent_period = ${rent_period},
            rent_currency = ${rent_currency}, bedrooms = ${bedrooms}, images = ${imageArray},
            offers = ${offerArray} WHERE id = ${id} RETURNING *
        `

        if(!result || result.length === 0){
            return res.status(404).json({ success: false, message: "Rentad not found" })
        }

        res.status(200).json({ success: true, data: result })
    } catch (err) {
        console.log("Error in deleteById function in rentadsController", err)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        })
    }
}



// controller file (adjust import if needed)
// assume you have something like:
// import { neon } from "@neondatabase/serverless"
// export const sql = neon(process.env.DATABASE_URL)
// and you're importing `sql` here

export const filterRentad = async (req, res) => {
  try {
    const { data } = req.query
    const query = JSON.parse(data || "{}")

    // require at least one filter
    if (
      !(Array.isArray(query.offers) && query.offers.length > 0) &&
      !query.bedrooms &&
      !query.property &&
      !query.minRent &&
      !query.maxRent &&
      !query.minArea &&
      !query.maxArea
    ) {
      return res.status(400).json({ success: false, message: "At least one field required" })
    }

    const whereClauses = []
    const params = []
    let idx = 1 // parameter index

    if (query.property) {
      whereClauses.push(`rentads.property ILIKE $${idx}`)
      params.push(`%${query.property}%`)
      idx++
    }

    if (query.bedrooms) {
      whereClauses.push(`rentads.bedrooms = $${idx}`)
      params.push(query.bedrooms)
      idx++
    }

    if (query.minRent) {
      whereClauses.push(`rentads.rent >= $${idx}`)
      params.push(query.minRent)
      idx++
    }

    if (query.maxRent) {
      whereClauses.push(`rentads.rent <= $${idx}`)
      params.push(query.maxRent)
      idx++
    }

    if (query.minArea) {
      whereClauses.push(`rentads.area >= $${idx}`)
      params.push(query.minArea)
      idx++
    }

    if (query.maxArea) {
      whereClauses.push(`rentads.area <= $${idx}`)
      params.push(query.maxArea)
      idx++
    }

    if (Array.isArray(query.offers) && query.offers.length > 0) {
      // pass JS array and cast to text[] in SQL
      whereClauses.push(`rentads.offers && $${idx}::text[]`)
      params.push(query.offers)
      idx++
    }

    let queryText = "SELECT rentads.*, locations.lat AS latitude, locations.lon AS longitude FROM rentads INNER JOIN locations ON rentads.location_id = locations.id"

    if (whereClauses.length > 0) {
      queryText += " WHERE " + whereClauses.join(" AND ")
    }
    queryText += " ORDER BY rentads.created_at DESC"

    // Use sql.query for conventional calls with placeholders
    const result = await sql.query(queryText, params)

    // neon/sql.query often returns an object with `rows`; fallback to result directly
    const rows = result?.rows ?? result

    return res.status(200).json({ success: true, data: rows })
  } catch (err) {
    console.error("Error in filterRentad function in rentadsController", err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}


export const searchRentad = async (req, res) => {
    try {
        const { location } = req.query

        if(!location){
            return res.status(400).json({ success: false, message: "Location field is required"})
        }

        const result = await sql`
            SELECT rentads.*, locations.lat AS latitude, locations.lon AS longitude FROM rentads 
            INNER JOIN locations ON rentads.location_id = locations.id
            WHERE locations.city ILIKE ${'%' + location + '%'} OR locations.county ILIKE ${'%' + location + '%'} OR 
            locations.neighbourhood ILIKE ${'%' + location + '%'} OR locations.road ILIKE ${'%' + location + '%'} OR 
            locations.suburb ILIKE ${'%' + location + '%'}
            ORDER BY rentads.created_at DESC
        `

        res.status(200).json({ success: true, data: result })
    } catch (err) {
        console.log("Error in searchRentad func in rentadControllers.js")
        return res.status(500).json({ success: false, message: "Internet server error" })
    }
}