const express = require("express")
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NodeJS API",
            version: "1.0.0",
            description: "A simple NodeJS API",
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            }
        ],
        servers: [
            {
                url: "http://localhost:5000/api/",
            },
        ],
    },
    apis: ["./src/routers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, post) {
    //swagger sayfası
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    //json dökümanı
    app.get(("docs.json", (req, res) => {
        res.setHeader("Content-Type", "applicatin/json")
        res.send(swaggerSpec)
    }))
    console.log("swagger ok")
}

module.exports = swaggerDocs