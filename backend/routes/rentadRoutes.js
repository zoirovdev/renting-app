import express from "express"
import { getAll, create, getRentad, uploadImage, searchRentad, getRentadsWithLocations, getAllByUserId } from "../controllers/rentadControllers.js"

const router = express.Router()


router.get("/", getAll)

router.post("/", create)

router.get("/search", searchRentad)

router.get("/getWithLocations", getRentadsWithLocations)

router.get("/user/:id", getAllByUserId)

router.get("/:id", getRentad)

router.post("/upload", uploadImage)




export default router