import express from 'express';
import { getNotifications, markSeen, addNotification, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.get('/', protect, getNotifications);
router.post('/add', protect, addNotification);
router.post('/:id', protect, markSeen);
router.delete('/:id', protect, deleteNotification);

export default router;