const express = require("express");

const {
	AddUser,
	DeleteUser,
	FindUser,
	UpdateUser,
	getAllUser,
	createuser,
} = require("../control/userControl");

const router = express.Router();
const { login } = require("../control/SignInCognito.js");

router.post("/", AddUser);
router.post("/123", createuser);
router.post("/login", login);
router.delete("/:id", DeleteUser);
router.get("/:id", FindUser);
router.patch("/:id", UpdateUser);
router.get("/", getAllUser);
module.exports = router;
