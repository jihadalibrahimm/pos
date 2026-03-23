import express from 'express'
import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from '../controllers/adminTransactionsController.js'
import { protectAdmin, authorizeAdmin } from "../middlewares/adminAuth.js"


const router = express.Router()
router.use(protectAdmin, authorizeAdmin("admin", "super-admin"))

router.post("/", createTransaction)        
router.get("/", getAllTransactions)       
router.get("/:id", getTransactionById)    
router.put("/:id", updateTransaction)     
router.delete("/:id", deleteTransaction)    

export default router