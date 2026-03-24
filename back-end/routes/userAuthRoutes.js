import express from 'express'
import { registerUser, loginUser, logoutUser , getMe } from '../controllers/userAuthController.js'
import {protectUser} from '../middlewares/authUser.js'
import { validateBody } from '../middlewares/validate.js'
import { userLoginSchema, userRegisterSchema } from '../validators/authValidators.js'

const router = express.Router()

router.post('/register', validateBody(userRegisterSchema), registerUser)
router.post('/login', validateBody(userLoginSchema), loginUser)
router.get('/me', protectUser , getMe)
router.post('/logout', logoutUser)

export default router