const router = require("express").Router()
const { login, register, me, forgetPassword, resetCodeCheck, resetPassword } = require("../controllers/auth.controller")
const { tokenCheck } = require("../middlewares/auth")
const authValidation = require("../middlewares/validations/auth.validation")

// ! bearer token
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http  
 *      scheme: bearer  
 *      bearerFormat: JWT  
 */

// ! bearer token kullanılabilmesi için  aşağıdaki kısımın endpointe eklenmesi gerekmektedir
//  * /me:
//  *   get:
//  *     security: 
//  *      - bearerAuth: []
// ! bearer token



/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: email
 *         password:
 *           type: string
 *           description: password
 *       example:
 *         email: example@example.com
 *         password: examplePasword
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       example:
 *         success: true
 *         token: token
 *         message: Başarılı
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       500:
 *         description: Some server error
 */
router.post("/login", authValidation.login, login)

/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - lastname
 *       properties:
 *         email:
 *           type: string
 *           description: email
 *         password:
 *           type: string
 *           description: password
 *         name:
 *           type: string
 *           description: name
 *         lastname:
 *           type: string
 *           description: lastname
 *       example:
 *         email: example@example.com
 *         password: examplePasword
 *         name: example name
 *         lastname: example lastname
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterResponse:
 *       type: object
 *       example:
 *         success: example@example.com
 *         data: 
 *          name: example name
 *          lastname: example lastname
 *          email: ahexample@example.commet
 *          password: examplePasword
 *          reset: 
 *              code: null
 *              time: null
 *          _id: exampleID
 *          createdAt: examplecreatedAt
 *          updatedAt: exampleupdatedAt
 *          __v: 0
 *         message: Kayıt Başarıyla Eklendi
 */


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Kayıt Başarıyla Eklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       500:
 *         description: Some server error
 */
router.post("/register", authValidation.register, register)


/**
 * @swagger
 * components:
 *   schemas:
 *     MeResponse:
 *       type: object
 *       example:
 *         success: true
 *         data: 
 *          name: example name
 *          lastname: example lastname
 *          email: ahexample@example.commet
 *          password: examplePasword
 *          reset: 
 *              code: null
 *              time: null
 *          _id: exampleID
 *          createdAt: examplecreatedAt
 *          updatedAt: exampleupdatedAt
 *          __v: 0
 *         message: Kayıt Başarıyla Eklendi
 */


/**
 * @swagger
 * /me:
 *   get:
 *     security: 
 *      - bearerAuth: []
 *     summary: Me
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Kayıt Başarıyla Eklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       500:
 *         description: Some server error
 */
router.get("/me", tokenCheck, me)

router.post("/forget-password", forgetPassword)

router.post("/reset-code-check", resetCodeCheck)

router.post("/reset-password", resetPassword)

module.exports = router
