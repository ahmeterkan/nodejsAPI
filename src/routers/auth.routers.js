const router = require("express").Router()
const { login, register, me } = require("../controllers/auth.controller")
const { tokenCkeck } = require("../middlewares/auth")
const authValidation = require("../middlewares/validations/auth.validation")

router.post("/login", authValidation.login, login)

router.post("/register", authValidation.register, register)

router.get("/me", tokenCkeck, me)

module.exports = router
