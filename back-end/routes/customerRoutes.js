import express from 'express'

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController.js'

import { protectAny, authorizeAny } from '../middlewares/authAny.js'
import { validateBody } from '../middlewares/validate.js'
import { customerSchema } from '../validators/domainValidators.js'

const router = express.Router()

router.get('/', protectAny, authorizeAny("cashier", "manager", "admin", "super-admin"), getCustomers)
router.post('/', protectAny, authorizeAny("cashier", "manager", "admin", "super-admin"), validateBody(customerSchema), createCustomer)
router.put('/:id', protectAny, authorizeAny("cashier", "manager", "admin", "super-admin"), validateBody(customerSchema), updateCustomer)
router.delete('/:id', protectAny, authorizeAny("manager", "admin", "super-admin"), deleteCustomer)

export default router