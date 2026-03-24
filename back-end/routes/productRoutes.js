import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";
import { upload } from "../middlewares/multer.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { productCreateSchema, productUpdateSchema } from "../validators/domainValidators.js";

const router = express.Router();

router.get("/", protect, authorize("cashier", "manager", "admin"), getProducts);
router.post("/", protect, authorize("manager", "admin"), upload.single("image"), validateBody(productCreateSchema), createProduct);
router.put("/:id", protect, authorize("manager", "admin"), upload.single("image"), validateBody(productUpdateSchema), updateProduct);
router.delete("/:id", protect, authorize("manager", "admin"), deleteProduct);

export default router;
