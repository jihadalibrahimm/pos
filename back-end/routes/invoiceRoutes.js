import express from "express";
import {
  getInvoices,
  createInvoice,
  deleteInvoice
} from "../controllers/invoiceController.js";
import { protectAny, authorizeAny } from "../middlewares/authAny.js";
import { validateBody } from "../middlewares/validate.js";
import { createInvoiceSchema } from "../validators/domainValidators.js";

const router = express.Router();

router.get("/", protectAny, authorizeAny("cashier", "manager", "admin", "super-admin"), getInvoices);
router.post("/", protectAny, authorizeAny("cashier", "manager", "admin", "super-admin"), validateBody(createInvoiceSchema), createInvoice);
router.delete("/:id", protectAny, authorizeAny("manager", "admin", "super-admin"), deleteInvoice);

export default router;
