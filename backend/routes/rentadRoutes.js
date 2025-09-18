import express from "express"
import { getAll, create } from "../controllers/rentadControllers.js"

const router = express.Router()


router.get("/", getAll)


router.post("/", create)


export default router