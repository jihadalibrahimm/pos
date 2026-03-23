import express from 'express'

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController.js'

import { protect, authorize } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', protect, getCustomers)
router.post('/', protect, authorize("cashier", "manager", "admin"), createCustomer)
router.put('/:id', protect, authorize("cashier", "manager", "admin"), updateCustomer)
router.delete('/:id', protect, authorize("manager", "admin"), deleteCustomer)

export default router