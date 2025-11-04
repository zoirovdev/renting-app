import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"



import { sql } from "./config/db.js"
import { aj } from "./lib/arcjet.js"
import rentadRoutes from "./routes/rentadRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import locationRoutes from "./routes/locationRoutes.js"


dotenv.config()



const app = express()
const PORT = process.env.PORT || 8000
const __dirname = path.resolve()




app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
)
app.use(morgan("dev"))
// app.use(async (req, res, next) => {
//     try {
//         const decision = await aj.protect(req, {
//             requested: 1 // specifies that each request consumes 1 token
//         })

//         if(decision.isDenied()){
//             if(decision.reason.isRateLimit()){
//                 res.status(429).json({ error: "Too Many Requests" })
//             } else if(decision.reason.isBot()){
//                 res.status(403).json({ error: "Bot access denied" })
//             } else {
//                 res.status(403).json({ error: "Forbidden" })
//             }
//             return
//         }

//         // check spoofed bots
//         if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
//             res.status(403).json({ error: "Spoofed bot detected" })
//             return
//         }

//         next()
//     } catch (error) {
//         console.log("Arcjet error ", error)
//         next(error)
//     }
// })

app.use("/api/users", userRoutes)
app.use("/api/rentads", rentadRoutes)
app.use("/api/locations", locationRoutes)




if(process.env.NODE_ENV==="production"){
    // server our react app
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}


async function initDB(){
    try {
        // await sql`DROP TABLE IF EXISTS users CASCADE`;
        // await sql`DROP TABLE IF EXISTS rentads CASCADE`;
        // await sql`DROP TABLE IF EXISTS locations CASCADE`;

        await sql`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                firstname VARCHAR(100) NOT NULL,
                lastname VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `
        console.log('Users table created')

        // Create locations table second (no dependencies)
        await sql`
            CREATE TABLE IF NOT EXISTS locations(
                id SERIAL PRIMARY KEY,
                lat DOUBLE PRECISION NOT NULL,
                lon DOUBLE PRECISION NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                country VARCHAR(255) NOT NULL,
                county VARCHAR(255) NOT NULL,
                neighbourhood VARCHAR(255) NOT NULL,
                postcode VARCHAR(255) NOT NULL,
                road VARCHAR(255) NOT NULL,
                suburb VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `
        console.log('Locations table created')

        // Create rentads table last (depends on users and locations)
        await sql`
            CREATE TABLE IF NOT EXISTS rentads(
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                user_type VARCHAR(255) NOT NULL,
                user_phone VARCHAR(255) NOT NULL,
                user_name VARCHAR(255) NOT NULL,
                location_id INTEGER NOT NULL,
                location_display VARCHAR(255) NOT NULL,
                property VARCHAR(255) NOT NULL,
                area INTEGER NOT NULL,
                area_unit VARCHAR(255) NOT NULL,
                rent INTEGER NOT NULL,
                rent_currency VARCHAR(255) NOT NULL,
                rent_period VARCHAR(255) NOT NULL,
                bedrooms INTEGER NOT NULL,
                images TEXT[],
                offers TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_location
                    FOREIGN KEY (location_id)
                    REFERENCES locations(id)
                    ON DELETE CASCADE
            )
        `
        console.log('Rentads table created')

        console.log('Database initialized successfully')
    } catch (error){
        console.log("Error initDB", error)
        throw error // Re-throw to prevent server from starting
    }
}


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})

