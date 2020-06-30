const express = require("express");
const authController = require("../controllers/auth");
const isSignedIn = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", authController.postSignup);
router.post("/signin", authController.postSignin);
router.post("/logout", isSignedIn, authController.postLogout);

module.exports = router;
