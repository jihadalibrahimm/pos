import express from "express";
import {
  getInvoices,
  createInvoice,
  deleteInvoice
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/", getInvoices);
router.post("/", createInvoice);   
router.delete("/:id", deleteInvoice);

export default router;
