import express from 'express'
import {
    getNotifications,
    markSeen
} from '../controllers/notificationController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.get('/',protect, getNotifications)
router.post('/:id',protect, markSeen)

export default router