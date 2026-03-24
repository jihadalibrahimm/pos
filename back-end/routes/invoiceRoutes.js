import express from "express";
import {
  getInvoices,
  createInvoice,
  deleteInvoice
} from "../controllers/invoiceController.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { createInvoiceSchema } from "../validators/domainValidators.js";

const router = express.Router();

router.get("/", protect, authorize("cashier", "manager", "admin"), getInvoices);
router.post("/", protect, authorize("cashier", "manager", "admin"), validateBody(createInvoiceSchema), createInvoice);
router.delete("/:id", protect, authorize("manager", "admin"), deleteInvoice);

export default router;
