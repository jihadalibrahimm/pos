import express from 'express'

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController.js'

import {protect,authorize} from '../middlewares/auth.js'

const router = express.Router()

router.get('/', protect, getCustomers)
router.post('/', protect, authorize("manager", "admin", "super-admin"),createCustomer)
router.put('/:id', protect, authorize("manager", "admin", "super-admin"),updateCustomer)
router.delete('/:id', protect, authorize("admin", "super-admin"),deleteCustomer)

export default router