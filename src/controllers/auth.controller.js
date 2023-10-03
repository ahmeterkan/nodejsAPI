const user = require("../models/user.model")
const bcrypt = require("bcrypt")
const APIError = require("../utils/errors")
const Response = require("../utils/respose")

const login = async (req, res) => {
    console.log(req.body)

    return res.json(req.body)
}

const register = async (req, res) => {
    const { email } = req.body //req.body.email

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

module.exports = {
    login,
    register
}