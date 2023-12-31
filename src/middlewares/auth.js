const jwt = require("jsonwebtoken")
const APIError = require("../utils/errors")
const user = require("../models/user.model")

// ! token oluşturma
const createToken = async (user, res) => {
    const payload = {
        sub: user._id,
        name: user.name
    }

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    return res.status(201).json({
        succuss: true,
        token,
        message: "Başarılı"
    })
}

// ! token kontrol etme

const tokenCheck = async (req, res, next) => {
    const headerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ")

    if (!headerToken) {
        throw new APIError("Geçersiz Oturum Lütfen Oturum Açın", 401)
    }
    const token = req.headers.authorization.split(" ")[1]
    await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err)
            throw new APIError("Geçersiz Token", 401)
        const userData = await user.findById(decoded.sub).select("_id name last email")

        if (!userData)
            throw new APIError("Geçersiz Token", 401)

        req.user = userData
        next()
    })
}

const createTemporaryToken = async (userId, email) => {
    const payload = {
        sub: userId,
        email
    }

    const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN
    })
    return "Bearer " + token
}

const decodedTemporaryToken = async (temproraryToken) => {
    const token = temproraryToken.split(" ")[1]
    let userInfo
    await jwt.verify(token, process.env.JWT_TEMPORARY_KEY, async (err, decoded) => {
        if (err) throw new APIError("Geçersiz Token", 401)

        userInfo = await user.findById(decoded.sub).select("_id name lastname email")
        if (!userInfo) throw new APIError("Geçersiz Token", 401)
    })
    return userInfo
}

module.exports = {
    createToken,
    tokenCheck,
    createTemporaryToken,
    decodedTemporaryToken
}