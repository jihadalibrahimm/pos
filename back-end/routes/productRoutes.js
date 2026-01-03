import express from 'express'

import {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/ProductController.js'
import { authorize, protect } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', protect, authorize('admin', 'manager'), createProduct)
router.get('/', protect, getProduct)
router.put('/:id', protect, authorize('admin', 'manager'),updateProduct)
router.delete('/:id', protect, authorize('admin'),deleteProduct)

export default router