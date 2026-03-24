import express from 'express'

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController.js'

import { protect, authorize } from '../middlewares/auth.js'
import { validateBody } from '../middlewares/validate.js'
import { customerSchema } from '../validators/domainValidators.js'

const router = express.Router()

router.get('/', protect, getCustomers)
router.post('/', protect, authorize("cashier", "manager", "admin"), validateBody(customerSchema), createCustomer)
router.put('/:id', protect, authorize("cashier", "manager", "admin"), validateBody(customerSchema), updateCustomer)
router.delete('/:id', protect, authorize("manager", "admin"), deleteCustomer)

export default router