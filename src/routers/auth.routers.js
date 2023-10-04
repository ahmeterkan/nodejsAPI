const router = require("express").Router()
const { login, register, me, forgetPassword } = require("../controllers/auth.controller")
const { tokenCkeck } = require("../middlewares/auth")
const authValidation = require("../middlewares/validations/auth.validation")

router.post("/login", authValidation.login, login)

router.post("/register", authValidation.register, register)

router.get("/me", tokenCkeck, me)

router.post("/forget-password", forgetPassword)

module.exports = router
