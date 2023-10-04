const user = require("../models/user.model")
const bcrypt = require("bcrypt")
const APIError = require("../utils/errors")
const Response = require("../utils/response")
const { createToken, tokenCkeck, createTemporaryToken, decodedTemporaryToken } = require("../middlewares/auth")
const crypto = require("crypto")
const sendEmail = require("../utils/sendMail")
const moment = require("moment/moment")

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

const forgetPassword = async (req, res) => {
    const { email } = req.body

    const userInfo = await user.findOne({ email }).select(" name lastname email ")

    if (!userInfo || userInfo === null) return new APIError("Geçersiz kullancı ", 400)

    const resetCode = crypto.randomBytes(3).toString("hex")

    await sendEmail({
        from: process.env.EMAIL_FROM,
        to: userInfo.email,
        subject: "Şifre Sıfırlama",
        text: `Şifre Sıfırlama Kodunuz: ${resetCode}`,
    })

    await user.updateOne(
        { email },
        {
            reset: {
                code: resetCode,
                time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss")
            }
        }
    )
    console.log("1");
    return new Response(true, "Lütfen mail kutunuzu kontrol ediniz").success(res)
}

const resetCodeCheck = async (req, res) => {
    const { email, code } = req.body

    const userInfo = await user.findOne({ email }).select("_id name lastname email reset")
    if (!userInfo) throw new APIError("Geçersiz kod", 401)
    const dbTime = moment(userInfo.reset.time)
    const nowTime = moment(new Date())

    const timeDiff = dbTime.diff(nowTime, "m")

    if (timeDiff <= 0 || userInfo.reset.code !== code) {
        throw new APIError("Geçersiz Kod", 401)
    }
    const temporaryToken = await createTemporaryToken(userInfo._id, userInfo.email)

    return new Response({ temporaryToken }, "Şifre sıfırlama yapabilirsiniz").success(res)
}

const resetPassword = async (req, res) => {
    const { password, temporaryToken } = req.body

    const decodedToken = await decodedTemporaryToken(temporaryToken)

    const hashPassword = await bcrypt.hash(password, 10)
    await user.findByIdAndUpdate(
        { _id: decodedToken._id },
        {
            reset: {
                code: null,
                time: null
            },
            password: hashPassword
        }
    )

    return new Response(decodedToken, "Şifre sıfırlama başarılı").success(res)
}
module.exports = {
    login,
    register,
    me,
    forgetPassword,
    resetCodeCheck,
    resetPassword
}