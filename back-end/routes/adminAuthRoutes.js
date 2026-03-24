import express from 'express'

import {adminRegister, adminLogin, adminLogout, getAdminProfile} from '../controllers/adminAuthController.js'
import {protectAdmin} from '../middlewares/adminAuth.js'
import { validateBody } from '../middlewares/validate.js'
import { adminLoginSchema, adminRegisterSchema } from '../validators/authValidators.js'

const router = express.Router()

router.post('/register', validateBody(adminRegisterSchema), adminRegister)
router.post('/login', validateBody(adminLoginSchema), adminLogin)
router.post('/logout',adminLogout)
router.get('/me', protectAdmin ,getAdminProfile)

export default router