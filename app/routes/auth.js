const express = require("express");
const auth = require("../controllers/auth");

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/signin", auth.signin);
router.post("/signin/new_token", auth.refreshToken);
router.get("/info", auth.info);
router.get("/logout", auth.logout);
module.exports = router;
