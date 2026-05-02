const express = require("express");
const router = express.Router();

const {
  generateBill,
  getMyBills,
  getAllBills,
  updatePaymentStatus
} = require("../controllers/billingController");

const { protect, authorizeRoles } = require("../middlewear/authMiddlewear");

// 🔥 Generate Bill (Admin)
router.post("/generate", protect, authorizeRoles("admin"), generateBill);

// 👤 Patient
router.get("/my", protect, authorizeRoles("patient"), getMyBills);

// 👑 Admin
router.get("/", protect, authorizeRoles("admin"), getAllBills);

// 💳 Update Payment
router.put("/:id", protect, authorizeRoles("admin"), updatePaymentStatus);

// 💳 Pay Bill (Patient Mock Gateway)
router.post("/:id/pay", protect, authorizeRoles("patient"), require("../controllers/billingController").payBill);

module.exports = router;