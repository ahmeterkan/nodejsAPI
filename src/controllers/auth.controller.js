const user = require("../models/user.model")
const bcrypt = require("bcrypt")
const APIError = require("../utils/errors")
const Response = require("../utils/response")
const { createToken, tokenCkeck } = require("../middlewares/auth")

// ! login fonksiyonu
const login = async (req, res) => {
    const { email, password } = req.body // email=req.body.email

    const userData = await user.findOne({ email })

    if (!userData) {
        throw new APIError("Email veya şifre yanlış", 401)
    }
    // ! şifre çözümleme
    const comparePassword = await bcrypt.compare(password, userData.password)

    if (!comparePassword) {
        throw new APIError("Email veya şifre yanlış", 401)
    }

    createToken(userData, res)

    next()
}

// ! register fonksiyonu
const register = async (req, res) => {
    const { email } = req.body //email = req.body.email

    const userCheck = await user.findOne({ email })

    if (userCheck) {
        throw new APIError("Girmiş Olduğunuz Email Kullanımda !", 401)
    }

    req.body.password = await bcrypt.hash(req.body.password, 10)

    const userData = new user(req.body)

    await userData.save()
        .then((data) => {
            return new Response(data, "Kayıt Başarıyla Eklendi").created(res)
        })
        .catch((err) => {
            throw new APIError(`Kullanıcı Kayıt Edilemedi ${err}`, 400)
        })


}

const me = async (req, res) => {
    return new Response(req.user).success(res)
}

module.exports = {
    login,
    register,
    me
}