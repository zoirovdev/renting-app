import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"



import { sql } from "./config/db.js"


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


app.get("/", (req, res) => {
    res.send("Everything is working!")
})


async function initDB(){
    try {
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
                details VARCHAR(255) NOT NULL,
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

