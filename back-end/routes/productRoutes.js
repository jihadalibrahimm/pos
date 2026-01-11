import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getProducts); // مؤقت بدون حماية
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
