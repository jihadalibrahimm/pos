import express from 'express'

import {adminRegister, adminLogin, adminLogout, getAdminProfile} from '../controllers/adminAuthController.js'
import {protectAdmin} from '../middlewares/adminAuth.js'

const router = express.Router()

router.post('/register',adminRegister)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)
router.get('/me', protectAdmin ,getAdminProfile)

export default router