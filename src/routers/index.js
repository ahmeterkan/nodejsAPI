const router = require("express").Router()

const multer = require("multer")
const upload = require("../middlewares/lib/upload")
const auth = require("./auth.routers")
const APIError = require("../utils/errors")
const Response = require("../utils/response")

router.use(auth)

router.post("/upload", function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError)
            throw new APIError("Resim yüklenirken multer kaynaklı hata çıktı: ", err)
        else if (err)
            throw new APIError("Resim yüklenirken hata çıktı: ", err)
        else
            return new Response(req.savedImages, "Yükleme başarılı").success(res)
    })
})

module.exports = router