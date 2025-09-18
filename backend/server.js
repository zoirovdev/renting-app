import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"



import { sql } from "./config/db.js"
import { aj } from "./lib/arcjet.js"
import rentadRoutes from "./routes/rentadRoutes.js"
import userRoutes from "./routes/userRoutes.js"


dotenv.config()



const app = express()
const PORT = process.env.PORT || 8000



app.use(express.json())
app.use(cors())
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
)
app.use(morgan("dev"))
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1 // specifies that each request consumes 1 token
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({ error: "Too Many Requests" })
            } else if(decision.reason.isBot()){
                res.status(403).json({ error: "Bot access denied" })
            } else {
                res.status(403).json({ error: "Forbidden" })
            }
            return
        }

        // check spoofed bots
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({ error: "Spoofed bot detected" })
            return
        }

        next()
    } catch (error) {
        console.log("Arcjet error ", error)
        next(error)
    }
})

app.use("/api/rentads", rentadRoutes)
app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
    res.send("Everything is working!")
})


async function initDB(){
    try {
        // await sql`DROP TABLE IF EXISTS rentads CASCADE`
        // await sql`DROP TABLE IF EXISTS users CASCADE`

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
        await sql`
            CREATE TABLE IF NOT EXISTS rentads(
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                details VARCHAR(700) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                images TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
        `

        console.log('Database initialized successfully')
    } catch (error){
        console.log("Error initDB", error)
    }
}


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})

