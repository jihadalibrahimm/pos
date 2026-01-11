import express from 'express'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/adminUsersController.js'
import { protectAdmin, authorizeAdmin } from '../middlewares/adminAuth.js'

const router = express.Router()

router.use(protectAdmin, authorizeAdmin('admin', 'super-admin'))

router.get('/', getUsers)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
