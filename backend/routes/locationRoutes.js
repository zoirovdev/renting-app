import express from "express"
import { create, get } from "../controllers/locationControllers.js"



const router = express.Router()


router.post("/", create)


router.get("/:id", get)


export default router