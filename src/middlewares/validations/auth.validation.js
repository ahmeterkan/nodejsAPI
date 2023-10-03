const joi = require("joi")
const APIError = require("../../utils/errors")

class AuthValidation {
    constructor() {

    }
    static register = async (req, res, next) => {
        try {
            await joi.object(({
                name: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "İsim Alanı Normal Metin Olmalıdır",
                    "string.empty": "İsim Alanı Boş Olamaz",
                    "string.min": "İsim Alanı En Az 3 Karakte Olmalıdır",
                    "string.max": "İsim Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "İsim Alanı Zorunludur"
                }),
                lastname: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Soyad Alanı Normal Metin Olmalıdır",
                    "string.empty": "Soyad Alanı Boş Olamaz",
                    "string.min": "Soyad Alanı En Az 3 Karakter Olmalıdır",
                    "string.max": "Soyad Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "Soyad Alanı Zorunludur"
                }),
                email: joi.string().email().trim().min(5).max(100).required().messages({
                    "string.base": "Email Alanı  Normal Metin Olmalıdır",
                    "string.empty": "Email Alanı Boş Olamaz",
                    "string.min": "Email Alanı En Az 5 Karakter Olmalıdır",
                    "string.email": "Lütfen Geçerli Bir Email Giriniz",
                    "string.max": "Email Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "Email Alanı Zorunludur"
                }),
                password: joi.string().trim().min(3).max(33).required().messages({
                    "string.base": "Şifre Alanı Normal Metin Olmalıdır",
                    "string.empty": "Şifre Alanı Boş Olamaz",
                    "string.min": "Şifre Alanı En Az 3 Karakter Olmalıdır",
                    "string.max": "Şifre Alanı En Fazla 33 Karakterden Oluşabilir",
                    "string.required": "Şifre Alanı Zorunludur"
                })
            })).validateAsync(req.body)
        } catch (error) {
            if (error.details)
                throw new APIError(error.details[0].message, 400)
            else
                throw new APIError(`${error} ${__dirname}`, 400)
        }
        next()
    }
}

module.exports = AuthValidation