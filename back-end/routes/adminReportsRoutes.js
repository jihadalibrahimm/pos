import express from "express"
import { dailyReport, rangeReport, topProducts } from "../controllers/reportsController.js"
import { protectAdmin, authorizeAdmin } from "../middlewares/adminAuth.js"

const router = express.Router()

router.get("/daily", protectAdmin, authorizeAdmin("manager", "admin", "super-admin"), dailyReport)
router.post("/range", protectAdmin, authorizeAdmin("manager", "admin", "super-admin"), rangeReport)
router.get("/top-products", protectAdmin, authorizeAdmin("manager", "admin", "super-admin"), topProducts)

export default router
