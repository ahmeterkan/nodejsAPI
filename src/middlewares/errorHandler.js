const APIError = require("../utils/errors")

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode || 400)
            .json({
                success: false,
                message: err.message
            })
    }
    if (err.name === "CastError") {
        return res.status(500).json({
            success: false,
            message: "İzin verilmeyen karakter kullanımı!"
        })
    }
    return res.status(500).json({
        success: false,
        message: "Bir hata ile karşılaştık lütfen apinizi kontrol ediniz!"
    })
}
module.exports = errorHandlerMiddleware