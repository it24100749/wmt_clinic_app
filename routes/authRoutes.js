const express = require("express");
const router = express.Router();
const { registerUser, loginUser, createUser, getUserProfile, getAllUsers, getDoctors } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

const { protect, authorizeRoles } = require("../middlewear/authMiddlewear");
router.get("/me", protect, getUserProfile);

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.post("/users", protect, authorizeRoles("admin"), createUser);

router.get("/doctors", protect, getDoctors);

module.exports = router;