var express = require("express");
var router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
const userValidation = require("../validations/userValidation");
const validate = require("../utils/Validate");


/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:            # arbitrary name for the security scheme
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "user_id"
 *               name: "user_name"
 *               email: "user_email@example.com"
 *       '400':
 *         description: Bad Request. Invalid user data or user already exists.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid user data
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.post("/register", validate(userValidation.createUser), registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Log in an existing user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "user_id"
 *               name: "user_name"
 *               email: "user_email@example.com"
 *               token: "generated_token"
 *       '400':
 *         description: Bad Request. Invalid user data or authentication failed.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid user data
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.post("/login", loginUser);

module.exports = router;