import express from "express"
import { getAll, create, getRentad, uploadImage, searchRentad } from "../controllers/rentadControllers.js"

const router = express.Router()


router.get("/", getAll)

router.post("/", create)

router.get("/search", searchRentad)

router.get("/:id", getRentad)

router.post("/upload", uploadImage)




export default router