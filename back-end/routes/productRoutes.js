import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";
import { upload } from "../middlewares/multer.js";
import { protectAny, authorizeAny } from "../middlewares/authAny.js";
import { validateBody } from "../middlewares/validate.js";
import { productCreateSchema, productUpdateSchema } from "../validators/domainValidators.js";

const router = express.Router();

router.get("/", protectAny, authorizeAny("cashier", "manager", "admin", "super-admin"), getProducts);
router.post("/", protectAny, authorizeAny("manager", "admin", "super-admin"), upload.single("image"), validateBody(productCreateSchema), createProduct);
router.put("/:id", protectAny, authorizeAny("manager", "admin", "super-admin"), upload.single("image"), validateBody(productUpdateSchema), updateProduct);
router.delete("/:id", protectAny, authorizeAny("manager", "admin", "super-admin"), deleteProduct);

export default router;
