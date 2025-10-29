import express from "express"
import { getAll, create, getRentad, uploadImage, 
getAllByUserId, sortByOffers, sortByLowestRent, getWithoutRieltor, getNearby, deleteById, 
update, filterRentad,
searchRentad
} from "../controllers/rentadControllers.js"

const router = express.Router()


router.get("/", getAll)

router.post("/", create)

router.get("/filter", filterRentad)

router.get("/search", searchRentad)

router.get("/sort-by-lowest-rents", sortByLowestRent)

router.get("/get-without-rieltor", getWithoutRieltor)

router.get("/get-nearby", getNearby)


router.get("/sort-by-offers/:filter", sortByOffers)


router.get("/user/:id", getAllByUserId)

router.get("/:id", getRentad)

router.delete("/:id", deleteById)

router.post("/upload", uploadImage)

router.put("/:id", update)




export default router