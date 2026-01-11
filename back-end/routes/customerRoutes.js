import express from 'express'

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController.js'

import { protectAdmin, authorizeAdmin } from '../middlewares/adminAuth.js'

const router = express.Router()

router.get('/', protectAdmin, getCustomers)
router.post('/', protectAdmin, authorizeAdmin("manager", "admin", "super-admin"), createCustomer)
router.put('/:id', protectAdmin, authorizeAdmin("manager", "admin", "super-admin"), updateCustomer)
router.delete('/:id', protectAdmin, authorizeAdmin("admin", "super-admin"), deleteCustomer)

export default router