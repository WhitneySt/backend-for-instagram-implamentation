const express = require("express");
const instagramController = require("../controllers/instagramController");

const router = express.Router();

router.post("/auth", instagramController.exchangeCodeForToken);
router.post("/user-info", instagramController.getUserInfo);
router.post("/user-media", instagramController.getUserMedia);
router.post("/public-account-info", instagramController.getPublicAccountInfo);
router.post("/public-account-media", instagramController.getPublicAccountMedia);

module.exports = router;
