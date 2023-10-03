require("express-async-errors")
const express = require("express")
const app = express()
require("dotenv").config()
require("./src/db/dbConnection")
const port = process.env.PORT || 5001
const router = require("./src/routers")
const errorHandlerMiddleware = require("./src/middlewares/errorHandler")
const cors = require("cors")
const corsOptions = require("./src/helpers/corsOptions")
const mongoSanitize = require("express-mongo-sanitize")

// ! Middleware
app.use(express.json())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.use(cors(corsOptions))

app.use(mongoSanitize({
    replaceWith:"_",
}))

app.use("/api", router)

// ! Hata yakalama
app.use(errorHandlerMiddleware)

app.listen(port, () => {
    console.log(`server ${port} portundan çalışıyor`)
})